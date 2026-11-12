# StudyConcursos

Next.js (front + back) · Prisma · Supabase (PostgreSQL) · Auth.js

## Rodar localmente

1. Crie um projeto grátis em https://supabase.com
2. No projeto, clique em **Connect** e copie as strings de conexão (veja `.env.example`)
3. No terminal:

```bash
npm install
cp .env.example .env      # cole DATABASE_URL, DIRECT_URL e AUTH_SECRET
npx prisma db push        # cria as tabelas no Supabase (só uma vez / quando mudar o schema)
npm run dev
```

Acesse http://localhost:3000

## Publicar na Vercel

1. Suba o projeto no GitHub e importe na Vercel
2. Em **Settings > Environment Variables**, adicione `DATABASE_URL`, `DIRECT_URL` e `AUTH_SECRET`
3. Faça o deploy

Obs.: as tabelas já foram criadas pelo `prisma db push`, o deploy não mexe no banco.
