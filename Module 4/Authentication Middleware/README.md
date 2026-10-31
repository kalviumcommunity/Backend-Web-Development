# Authentication API

Express authentication API using Prisma, SQLite, and asynchronous `bcryptjs`
password hashing.

## Setup

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm start
```

The server runs at `http://localhost:3000`. `.env.example` contains only local
configuration. Never commit `.env`, database files, passwords, or hashes.

## Endpoints

Register with `POST /auth/register`:

```json
{ "name": "Sam", "email": "sam@example.com", "password": "correct horse battery staple" }
```

Login with `POST /auth/login`:

```json
{ "email": "sam@example.com", "password": "correct horse battery staple" }
```

Successful responses contain only `id`, `name`, and normalized `email`.
Malformed input returns `400`, duplicate normalized email returns `409`, invalid
credentials return the same generic `401`, and unexpected failures return a
generic `500`.

## Tests

```bash
npm test
```

Tests use the ignored local `test.db` SQLite database.
