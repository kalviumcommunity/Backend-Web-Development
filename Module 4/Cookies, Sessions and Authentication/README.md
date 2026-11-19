# LU48 Starter — Session Authentication

## Setup

```bash
cp .env.example .env
npm install
npm run setup
npm run dev
```

Set `COOKIE_SECRET` in `.env` to at least 32 random characters. Keep `COOKIE_SECURE=false` for local HTTP; production must use HTTPS with `COOKIE_SECURE=true`.

Seeded demo account: `sam@example.com` / `SessionDemo!48`.

## Implement

The authentication flow is implemented in:

- `src/routes/authRoutes.js`
- `src/session/sessionStore.js`
- `src/middleware/requireSession.js`

`POST /auth/login` accepts a JSON `email` and `password`, verifies the seeded
user, and returns `{ "user": { "id", "name", "email" } }`. It sets a signed,
HTTP-only `sid` cookie. `GET /auth/me` returns the authenticated user in the
same shape. `POST /auth/logout` destroys the server-side session and clears the
cookie.

Sessions are stored in memory and expire after `SESSION_TTL_MS` (one hour by
default), so they are cleared when the server restarts. Use Postman's cookie jar
or curl `-c cookies.txt` and `-b cookies.txt` to preserve the cookie between
requests.

Run the focused authentication tests with `npm test`.
