# Database Integration

The API stores posts in PostgreSQL through Prisma. Prisma stays behind the repository boundary; services and controllers use the existing asynchronous application contract.

## Setup

Copy `.env.example` to `.env` and set `DATABASE_URL` to a PostgreSQL database you control. Never commit `.env` or real credentials.

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm start
```

`prisma migrate dev` applies the committed migration and can create a named migration for future schema changes; use `npm run prisma:deploy` to apply committed migrations in a deployed environment.

The seed command is repeatable and only inserts the demo user and posts when they are absent. For a clean local database, create a separate development database and run `npx prisma migrate reset` there; this drops existing data and must not be used against a database you need to preserve.

```bash
npm run prisma:format
npm run prisma:validate
npm run prisma:generate
```
