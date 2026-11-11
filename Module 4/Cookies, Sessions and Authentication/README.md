# LU48 — Cookies, Sessions and Authentication

Implements signed, opaque session cookies for an Express + Prisma API.

## Setup

```bash
cp .env.example .env
npm install
npm run setup
npm run dev
```

Set `COOKIE_SECRET` to a private random value of at least 32 characters. Keep `COOKIE_SECURE=false` for local HTTP testing. Set it to `true` in production behind HTTPS. Never commit `.env`.

Demo account seeded by `npm run setup`:
- Email: `sam@example.com`
- Password: `SessionDemo!48`

## Endpoints

- `POST /auth/login` — validates credentials, creates a server-side session and sets a signed `sid` cookie.
- `GET /auth/me` — verifies the signed cookie, resolves a live session, and returns safe identity fields.
- `POST /auth/logout` — destroys the server session and clears the cookie; safe to repeat.

## Verify with curl

Login and save the cookie:

```bash
curl -i -c cookies.txt -H "Content-Type: application/json" \
  -d '{"email":"sam@example.com","password":"SessionDemo!48"}' \
  http://localhost:3000/auth/login
```

Use the cookie for the protected identity endpoint:

```bash
curl -i -b cookies.txt http://localhost:3000/auth/me
```

Logout, then replay the old cookie jar (the session should no longer resolve):

```bash
curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:3000/auth/logout
curl -i -b cookies.txt http://localhost:3000/auth/me
```

Omitting or modifying the signed cookie must return `401 AUTH_REQUIRED`. Login with an unknown email and with a wrong password returns the same generic `401 INVALID_CREDENTIALS` response.

## Session storage note

The included in-memory `Map` is for learning and local execution only. Sessions disappear when the process restarts and are not shared across multiple instances. Production deployments should use a shared expiring store such as Redis, with server-side TTL/expiry and operational controls.
