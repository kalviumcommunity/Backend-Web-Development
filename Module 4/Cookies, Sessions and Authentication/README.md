# Session Authentication (Express + Prisma)

Server-side session authentication. Login creates a session on the server and
sends only an opaque, signed session ID in the `sid` cookie. No user data,
password or hash is ever stored in the cookie.

## Setup

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
node src/app.js
```

Set `COOKIE_SECRET` in `.env` to a random value of at least 32 characters. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Keep `COOKIE_SECURE=false` for local HTTP. In production use HTTPS with `COOKIE_SECURE=true`.
Never commit `.env`.

Seeded demo account: `sam@example.com` / `SessionDemo!48`

## Endpoints

| Method | Path | Behavior |
|---|---|---|
| POST | `/auth/login` | Verifies credentials, creates a server session, sets signed `sid` cookie, returns safe user fields (200). Generic 401 for unknown email or wrong password. |
| GET | `/auth/me` | Resolves the signed cookie through the session store and returns the user (200). Generic 401 `AUTH_REQUIRED` if the cookie is missing, tampered, expired, or orphaned. |
| POST | `/auth/logout` | Destroys the server session and clears the cookie with matching options. Always 204 (idempotent). |

## Cookie settings

`httpOnly: true`, `sameSite: 'lax'`, `signed: true`, `path: '/'`,
`secure` controlled by `COOKIE_SECURE`, and `maxAge` from `SESSION_TTL_MS`.
All options live in `src/config/cookieConfig.js`, so login and logout cannot drift apart.

## Verification (curl)

```bash
# 1. Login: expect 200 and Set-Cookie with sid, HttpOnly, SameSite=Lax
curl -i -c cookies.txt -X POST localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sam@example.com","password":"SessionDemo!48"}'

# 2. Wrong password: expect 401 INVALID_CREDENTIALS
curl -i -X POST localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sam@example.com","password":"wrong"}'

# 3. With cookie: expect 200
curl -i -b cookies.txt localhost:3000/auth/me

# 4. No cookie: expect 401
curl -i localhost:3000/auth/me

# 5. Tampered cookie: expect 401
curl -i --cookie "sid=s%3Afake.fake" localhost:3000/auth/me

# 6. Logout: expect 204 and a clearing Set-Cookie
cp cookies.txt old.txt
curl -i -b cookies.txt -c cookies.txt -X POST localhost:3000/auth/logout

# 7. Replay the old cookie: expect 401 (server session was destroyed)
curl -i -b old.txt localhost:3000/auth/me
```

With `COOKIE_SECURE=true`, `Secure` appears in `Set-Cookie`. Clients only send a
`Secure` cookie back over HTTPS.

## Project structure

- `src/routes/authRoutes.js`: login, me, logout
- `src/session/sessionStore.js`: in-memory session store
- `src/middleware/requireSession.js`: resolves the session for protected routes
- `src/repositories/userRepository.js`: Prisma queries (the only place Prisma is used for users)
- `src/config/cookieConfig.js`: central cookie options

## Production note

The in-memory `Map` session store is for learning and local use only. Sessions
are lost on restart and cannot be shared between server processes. Production
requires a shared expiring store such as Redis.