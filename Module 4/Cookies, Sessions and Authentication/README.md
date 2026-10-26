# LU48 Starter — Session Authentication

## Setup

```bash
cp .env.example .env
npm install
npm run setup
npm run dev
```

Set `COOKIE_SECRET` in `.env` to at least 32 random characters. Keep `COOKIE_SECURE=false` for local HTTP. The application always enables `Secure` when `NODE_ENV=production`, regardless of the `COOKIE_SECURE` value, so production must use HTTPS.

Seeded demo account: `sam@example.com` / `SessionDemo!48`.

## Implement

Complete the TODOs in:

- `src/routes/authRoutes.js`
- `src/session/sessionStore.js`
- `src/middleware/requireSession.js`

Required endpoints: `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`.

Use Postman cookie jar or curl `-c cookies.txt` and `-b cookies.txt` to preserve the cookie between requests.

The session store is an in-memory store intended for learning and local execution only.
It is cleared when the process restarts and cannot be shared between multiple server
processes. Production deployments should use a shared expiring store such as Redis.

## Verify the session lifecycle

```bash
# Login and save the signed cookie
curl -i -c cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{"email":"sam@example.com","password":"SessionDemo!48"}' \
  http://localhost:3000/auth/login
cp cookies.txt old-cookies.txt

# Resolve the server-side identity
curl -i -b cookies.txt http://localhost:3000/auth/me

# Revoke the server session and clear the browser cookie
curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:3000/auth/logout

# The copied pre-logout cookie is now rejected
curl -i -b old-cookies.txt http://localhost:3000/auth/me
```

Login and logout use the same `httpOnly`, `sameSite`, `secure`, `path`, and signing
configuration. Set `COOKIE_SECURE=true` when serving local HTTPS; production enables it
automatically through `NODE_ENV=production`.
