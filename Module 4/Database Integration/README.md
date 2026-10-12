# Database Integration Assignment Starter

Replace the in-memory repository implementation with PostgreSQL through Prisma. The starter already uses an asynchronous repository contract so services and controllers can remain stable during the swap.

## Run

```bash
npm install
npm run prisma:generate
npm run prisma:deploy
npm run db:seed
npm start
```

## Database setup

Copy `.env.example` to `.env` and replace the sample URL with credentials for a local PostgreSQL database. `.env` is ignored and must never be committed.

```bash
npm run prisma:format
npm run prisma:validate
npm run prisma:migrate
npm run db:seed
```

`prisma:migrate` creates and applies a development migration; use `prisma:deploy` to apply committed migrations in other environments. The seed command is idempotent: it upserts the demonstration author and starter posts. `db:reset` is destructive, prompts before dropping data, reapplies migrations, and reruns the seed. Back up any database before resetting it.
