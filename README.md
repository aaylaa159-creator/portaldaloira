# Portal da Loira

Portal de notícias regional construído com Next.js 16, TypeScript, Tailwind CSS v4 e Supabase.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Variáveis de ambiente (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX   # pageviews no site público (gtag)
NEXT_PUBLIC_GA4_PROPERTY_ID=344219037        # link Tempo real no painel /admin/analytics
NEXT_PUBLIC_USE_DEV_ONLY=false               # true = pula Supabase em dev
```

## Painel da redação (`/admin`)

### 1. Aplicar migrations no Supabase

Execute no **SQL Editor** do Supabase, nesta ordem:

1. [`supabase/schema.sql`](supabase/schema.sql)
2. [`supabase/seed.sql`](supabase/seed.sql) (opcional — conteúdo de exemplo)
3. [`supabase/migrations/002_editorial_auth.sql`](supabase/migrations/002_editorial_auth.sql) — restringe escrita à equipe editorial
4. [`supabase/migrations/004_authors_public_columns.sql`](supabase/migrations/004_authors_public_columns.sql) — oculta `email` e `user_id` dos autores para visitantes
5. [`supabase/migrations/003_reset_demo_views.sql`](supabase/migrations/003_reset_demo_views.sql) — zera views fictícias do seed (execute se já rodou o seed antigo)

Ou aplique 002 + 004 de uma vez (requer senha do banco no `.env.local`):

```bash
npm run db:apply-security
```

### 2. Configurar autenticação

1. **Authentication → Providers:** habilite **Email**, desabilite **Sign ups** públicos
2. **Authentication → Users → Add user:** crie contas para a redação (e-mail + senha)
3. Em cada usuário, edite **Raw App Meta Data:**

```json
{ "role": "editor" }
```

ou `"admin"` para administradores.

Somente usuários com `role` `editor` ou `admin` em `app_metadata` acessam `/admin`.

### 3. Vincular autor ao login (opcional)

Na tabela `authors`, defina `user_id` com o UUID do usuário em **Authentication → Users**. Assim a matéria pode ser assinada automaticamente pelo jornalista logado (evolução futura).

### 4. Acessar o painel

- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Após login: dashboard, notícias, editorias, autores, banners e relatório de acessos

### Funcionalidades do painel

| Seção | O que faz |
|-------|-----------|
| **Notícias** | Criar, editar, publicar, rascunho, upload de capa |
| **Editorias** | CRUD de categorias |
| **Autores** | CRUD de jornalistas/colunistas |
| **Banners** | Gerenciar espaços publicitários |
| **Acessos** | Contador real de views por matéria + atalho GA4 Tempo real |

## Google Analytics

### 1. Enviar pageviews do site (já integrado)

1. Crie uma propriedade GA4 em [analytics.google.com](https://analytics.google.com)
2. Copie o **Measurement ID** (`G-XXXXXXXXXX`)
3. Adicione `NEXT_PUBLIC_GA_MEASUREMENT_ID` no `.env.local` e na Vercel
4. Confirme em **Relatórios → Tempo real** ao navegar no site

### 2. Painel `/admin/analytics`

- **Contador interno (Supabase):** views reais por matéria, atualiza na hora.
- **Botão GA4 Tempo real:** abre o Google Analytics para visitas atuais.
- Configure `NEXT_PUBLIC_GA4_PROPERTY_ID` (número da propriedade GA4) para o link direto.

## Estrutura do banco

- `categories` — editorias
- `authors` — autores (com `user_id` opcional para login)
- `posts` — notícias (`status`: draft | published | scheduled)
- `ad_banners` — publicidade
- Storage `news-media` — imagens de capas e avatares

## Deploy

Configure as mesmas variáveis de ambiente na plataforma de hospedagem (Vercel, etc.) e execute as migrations no Supabase de produção.
