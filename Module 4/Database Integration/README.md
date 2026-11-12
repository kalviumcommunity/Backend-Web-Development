# Database Integration

This project uses PostgreSQL through Prisma behind an asynchronous repository contract, keeping services and controllers independent of the storage implementation.

## Run

```bash
npm install
npm run prisma:generate
npm start
```

The API reads `DATABASE_URL` from `.env`. Copy `.env.example` to `.env` and set a PostgreSQL connection string before running the commands. Never commit `.env` or real credentials.

## Schema and migrations

```bash
npm run prisma:format
npm run prisma:validate
npm run db:migrate -- --name initial_schema
npm run db:seed
```

The migration creates users, posts, comments, votes, follows, and tags with their relations, uniqueness rules, and lookup indexes. The seed command upserts one sample user and adds the sample posts only when they are not already present, so it can be repeated safely.

To reset a disposable development database, run `npx prisma migrate reset` from this directory. This drops all data in the configured database; verify `DATABASE_URL` points to a local development database first. Do not use this command for a shared or production database.

The post repository retains the asynchronous `findAll`, `findById`, `create`, `update`, and `remove` contract. Prisma is shared by the process in `src/db/prisma.js`; services and controllers do not import Prisma.
