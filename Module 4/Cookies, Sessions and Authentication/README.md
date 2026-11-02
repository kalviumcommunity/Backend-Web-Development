# LU48 — Session Authentication

## Setup

```powershell
npm install
Copy-Item .env.example .env
npm run setup
npm run dev
```

Set `COOKIE_SECRET` in `.env` to at least 32 random characters. Keep `COOKIE_SECURE=false` for local HTTP; production must use HTTPS with `COOKIE_SECURE=true`. `SESSION_TTL_MS` controls both the cookie lifetime and server-side expiry.

Seeded demo account: `sam@example.com` / `SessionDemo!48`.

The API provides `POST /auth/login`, `GET /auth/me`, and `POST /auth/logout`. Login verifies the password asynchronously, then stores only the user ID and expiry in an in-memory session store. The signed `sid` cookie contains only the opaque session ID. `/auth/me` verifies the cookie signature and resolves a live session before returning public user fields; logout removes the server record and clears the browser cookie.

The in-memory session store is for learning and local execution only. Restarts clear sessions, and separate application instances cannot share them. Production deployments need a shared expiring store such as Redis.

## Verify

Run these commands from this project directory in PowerShell, using `curl.exe` so PowerShell does not substitute its own `curl` alias:

```powershell
curl.exe -i -c cookies.txt -H "Content-Type: application/json" --data-raw '{"email":"sam@example.com","password":"SessionDemo!48"}' http://localhost:3000/auth/login
curl.exe -i -b cookies.txt http://localhost:3000/auth/me
curl.exe -i -b cookies.txt -c cookies.txt -X POST http://localhost:3000/auth/logout
curl.exe -i -b cookies.txt http://localhost:3000/auth/me
```

The login response should contain a signed, `HttpOnly`, `SameSite=Lax` `sid` cookie. The first `/auth/me` returns the safe identity; after logout, `/auth/me` returns generic `401 AUTH_REQUIRED`. For a tampering check, change one character in the cookie value sent to `/auth/me`; it must also return `401 AUTH_REQUIRED`. In production, `Secure` is set and clients must use HTTPS to send the cookie.
