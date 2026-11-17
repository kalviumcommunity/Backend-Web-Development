# Database Integration Assignment Starter

Replace the in-memory repository implementation with PostgreSQL through Prisma. The starter already uses an asynchronous repository contract so services and controllers can remain stable during the swap.

## Run

```bash
npm install
npm run prisma:format
npm run prisma:validate
npx prisma migrate dev --name initial_database
npm run prisma:generate
npm run prisma:seed
npm start
```

Set `DATABASE_URL` in `.env` to a PostgreSQL database before running the Prisma
commands. `.env.example` shows the expected format; never commit `.env` or real
credentials.

```bash
npm run prisma:seed
```

The seed command is safe to rerun and upserts the demo user and posts.
