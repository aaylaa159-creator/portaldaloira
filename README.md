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
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX   # opcional — Google Analytics 4
NEXT_PUBLIC_USE_DEV_ONLY=false               # true = pula Supabase em dev
```

## Painel da redação (`/admin`)

### 1. Aplicar migrations no Supabase

Execute no **SQL Editor** do Supabase, nesta ordem:

1. [`supabase/schema.sql`](supabase/schema.sql)
2. [`supabase/seed.sql`](supabase/seed.sql) (opcional — conteúdo de exemplo)
3. [`supabase/migrations/002_editorial_auth.sql`](supabase/migrations/002_editorial_auth.sql) — restringe escrita à equipe editorial

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
| **Acessos** | Views por matéria + link para Google Analytics 4 |

## Google Analytics

1. Crie uma propriedade GA4 em [analytics.google.com](https://analytics.google.com)
2. Copie o **Measurement ID** (`G-XXXXXXXXXX`)
3. Adicione `NEXT_PUBLIC_GA_MEASUREMENT_ID` no `.env.local`
4. Reinicie `npm run dev`
5. Confirme pageviews em **Relatórios → Tempo real** no GA4

## Estrutura do banco

- `categories` — editorias
- `authors` — autores (com `user_id` opcional para login)
- `posts` — notícias (`status`: draft | published | scheduled)
- `ad_banners` — publicidade
- Storage `news-media` — imagens de capas e avatares

## Deploy

Configure as mesmas variáveis de ambiente na plataforma de hospedagem (Vercel, etc.) e execute as migrations no Supabase de produção.
