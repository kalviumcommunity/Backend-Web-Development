# Repository Pattern Assignment

Refactor this small community-platform API so services depend on a repository boundary instead of the in-memory store.

## Run

```bash
npm install
npx prisma generate
npm start
```

Inspect the existing service and store before changing code. Implement the assignment described in the platform question. Keep routes, controllers, response shapes, and business behavior unchanged.

## Database setup

Copy `.env.example` to `.env` and set `DATABASE_URL` to a PostgreSQL database that you own.
Apply the committed migration and regenerate the typed client with:

```bash
npx prisma migrate dev
npx prisma generate
```

For a local development reset, use Prisma's explicit reset command only against a
development database:

```bash
npx prisma migrate reset
```

Never commit `.env` or real database credentials.

The starter intentionally contains the pre-refactor design. Do not add tests, specs, or platform-only assignment files to this repository.
