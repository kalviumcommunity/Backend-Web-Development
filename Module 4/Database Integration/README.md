# Database Integration and Authentication

The API uses PostgreSQL through Prisma for users and keeps authentication workflow in the service layer.

## Run

```bash
npm install
npm run prisma:generate
npm run db:migrate -- --name initial_auth_schema
npm start
```

Copy `.env.example` to `.env` and set `DATABASE_URL` to a local PostgreSQL database before running Prisma commands. Never commit `.env` or real credentials. The example URL is for local development only.

## Authentication

`POST /auth/register` accepts `name`, `email`, and `password`. Email is trimmed and lowercased before storage; passwords are hashed with bcrypt and only `passwordHash` is persisted. `POST /auth/login` accepts `email` and `password`. Both endpoints return only the user's `id`, `name`, and `email`. Invalid credentials use the same generic response for unknown emails and incorrect passwords.

## Prisma

The schema gives users unique emails and stores password hashes. Run these checks after schema changes:

```bash
npm run prisma:format
npm run prisma:validate
npm run prisma:generate
```

Use `npm run db:migrate:deploy` to apply committed migrations outside development. Never use a real or shared database for destructive development resets.
