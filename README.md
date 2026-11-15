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

## O que já funciona

- Cadastro e login
- Concursos, Disciplinas e Conteúdos (com subtópicos e importação do texto do edital)
- Planejamento: ciclo de estudos (blocos por disciplina, continua de onde parou) e agenda semanal
- Estudar: sessão com cronômetro (pausar/retomar), histórico e integração com o ciclo
- Desempenho: tempo por dia e por disciplina, sequência de estudos, progresso dos conteúdos e dificuldades
- Questões: registro de acertos/erros, percentual por disciplina e histórico com filtro
- Dashboard com resumo
- Demais telas do menu: "em breve"

> Ao atualizar o projeto, rode `npx prisma db push` novamente (o schema muda a cada fase).

## Publicar na Vercel

1. Suba o projeto no GitHub e importe na Vercel
2. Em **Settings > Environment Variables**, adicione `DATABASE_URL`, `DIRECT_URL` e `AUTH_SECRET`
3. Faça o deploy

Obs.: as tabelas já foram criadas pelo `prisma db push`, o deploy não mexe no banco.
