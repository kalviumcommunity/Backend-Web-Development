# Authentication API

This project provides registration and login endpoints using Express, Prisma,
SQLite, and asynchronous `bcryptjs` password hashing.

## Setup

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm start
```

The API listens on `http://localhost:3000` by default. The `.env.example` file
contains only local-development configuration; do not commit `.env` or database
files.

## Endpoints

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Sam","email":"sam@example.com","password":"correct horse battery staple"}'
```

Successful registration returns `201` and only the user's `id`, `name`, and
normalized `email`. Passwords are stored only as bcrypt hashes.

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sam@example.com","password":"correct horse battery staple"}'
```

Successful login returns `200` with the same safe user fields. Unknown emails
and incorrect passwords both return `401` with the identical
`INVALID_CREDENTIALS` response.

Malformed or missing fields return `400`; duplicate normalized emails return
`409`; unexpected failures return a generic `500` response.

## Tests

```bash
npm test
```

The test command creates/updates a local SQLite `test.db`, which is ignored by
Git.
