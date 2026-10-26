# Authentication Fundamentals Starter

## Setup

```bash
npm install
cp .env.example .env
npm run db:push
npm start
```

The SQLite datasource keeps local setup self-contained. Do not commit `.env` or `prisma/dev.db`.

## Endpoints

- `POST /auth/register`
- `POST /auth/login`

Registration accepts `name`, `email`, and `password`, normalizes the email, stores an asynchronous bcrypt hash, and returns `201` with only `id`, `name`, and `email`. Duplicate normalized emails return `409`.

Login accepts `email` and `password`, normalizes the email, and returns `200` with the safe user shape for valid credentials. Unknown emails and wrong passwords both return `401` with this identical body:

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

Malformed input returns `400`; unexpected errors return a controlled `500` response. Passwords and password hashes are never included in API responses or logs.
