/**
 * Aplica migrations de segurança pendentes no Supabase remoto.
 *
 * Configure no .env.local (não commitar):
 *   SUPABASE_DB_URL=postgresql://postgres:SUA_SENHA@db.fewyfqcldelamknckmcx.supabase.co:5432/postgres
 *
 * Ou apenas:
 *   SUPABASE_DB_PASSWORD=sua-senha-do-banco
 *
 * Senha: Supabase Dashboard → Project Settings → Database → Database password
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadEnvLocal() {
  const path = join(root, '.env.local');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function getConnectionString() {
  if (process.env.SUPABASE_DB_URL) return process.env.SUPABASE_DB_URL;
  const password = process.env.SUPABASE_DB_PASSWORD;
  if (password) {
    return `postgresql://postgres:${encodeURIComponent(password)}@db.fewyfqcldelamknckmcx.supabase.co:5432/postgres`;
  }
  return null;
}

async function verify(client) {
  const checks = [];

  const fn = await client.query(
    `SELECT proname FROM pg_proc WHERE proname = 'is_editorial_staff'`
  );
  checks.push({
    name: '002 — função is_editorial_staff',
    ok: fn.rowCount > 0,
  });

  const policy = await client.query(
    `SELECT with_check::text FROM pg_policies
     WHERE tablename = 'posts' AND policyname = 'posts_team_insert'`
  );
  const policyText = policy.rows[0]?.with_check ?? '';
  checks.push({
    name: '002 — posts_team_insert usa is_editorial_staff',
    ok: policyText.includes('is_editorial_staff'),
  });

  const cols = await client.query(
    `SELECT column_name
     FROM information_schema.column_privileges
     WHERE table_schema = 'public'
       AND table_name = 'authors'
       AND grantee = 'anon'
       AND privilege_type = 'SELECT'`
  );
  const anonCols = new Set(cols.rows.map((r) => r.column_name));
  checks.push({
    name: '004 — anon não lê email',
    ok: !anonCols.has('email') && anonCols.has('name'),
  });
  checks.push({
    name: '004 — anon não lê user_id',
    ok: !anonCols.has('user_id') && anonCols.has('slug'),
  });

  return checks;
}

async function main() {
  loadEnvLocal();
  const connectionString = getConnectionString();
  if (!connectionString) {
    console.error(
      'Defina SUPABASE_DB_URL ou SUPABASE_DB_PASSWORD no .env.local\n' +
        'Senha: Supabase Dashboard → Settings → Database → Database password'
    );
    process.exit(1);
  }

  const migrations = [
    '002_editorial_auth.sql',
    '004_authors_public_columns.sql',
  ];

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Conectado ao Supabase.\n');

  for (const file of migrations) {
    const sql = readFileSync(join(root, 'supabase/migrations', file), 'utf8');
    console.log(`Aplicando ${file}...`);
    await client.query(sql);
    console.log(`  OK\n`);
  }

  console.log('Verificação:');
  const checks = await verify(client);
  for (const { name, ok } of checks) {
    console.log(`  ${ok ? '✓' : '✗'} ${name}`);
  }

  await client.end();

  const failed = checks.filter((c) => !c.ok);
  if (failed.length > 0) {
    process.exit(1);
  }
  console.log('\nMigrations de segurança aplicadas com sucesso.');
}

main().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
