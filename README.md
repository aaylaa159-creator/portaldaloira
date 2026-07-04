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

# Google Analytics Data API (painel /admin/analytics — somente servidor)
GA4_PROPERTY_ID=123456789                    # ID numérico da propriedade GA4 (Admin → Configurações)
GA_SERVICE_KEY_BASE64=                       # JSON da conta de serviço em Base64 (ver README)
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
| **Acessos** | Métricas GA4 (usuários, sessões, pageviews) + contador interno por matéria |

## Google Analytics

### 1. Enviar pageviews do site (já integrado)

1. Crie uma propriedade GA4 em [analytics.google.com](https://analytics.google.com)
2. Copie o **Measurement ID** (`G-XXXXXXXXXX`)
3. Adicione `NEXT_PUBLIC_GA_MEASUREMENT_ID` no `.env.local` e na Vercel
4. Confirme em **Relatórios → Tempo real** ao navegar no site

### 2. Exibir métricas no painel `/admin/analytics`

O painel lê dados via **Google Analytics Data API** (conta de serviço):

1. [Google Cloud Console](https://console.cloud.google.com/) → ative **Google Analytics Data API**
2. Crie uma **conta de serviço** e baixe a chave JSON
3. GA4 → **Administrar → Acesso à propriedade** → adicione o e-mail da conta de serviço como **Leitor**
4. Copie o **ID da propriedade** (número, ex. `512345678`) em Configurações da propriedade
5. Converta o JSON em Base64 e configure:
   ```env
   GA4_PROPERTY_ID=512345678
   GA_SERVICE_KEY_BASE64=...
   ```
6. Adicione as mesmas variáveis na Vercel → **Settings → Environment Variables**
7. Faça redeploy

PowerShell (converter chave):
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\caminho\ga4-key.json"))
```

## Estrutura do banco

- `categories` — editorias
- `authors` — autores (com `user_id` opcional para login)
- `posts` — notícias (`status`: draft | published | scheduled)
- `ad_banners` — publicidade
- Storage `news-media` — imagens de capas e avatares

## Deploy

Configure as mesmas variáveis de ambiente na plataforma de hospedagem (Vercel, etc.) e execute as migrations no Supabase de produção.
