# LU48 — Session Authentication

## Setup

In PowerShell:

```powershell
Copy-Item .env.example .env
```

Prisma 7 requires Node.js `^20.19`, `^22.12`, or `>=24`.

Replace the `COOKIE_SECRET` placeholder in `.env` with a unique random value of at least 32 characters. Generate one with:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Then install dependencies, generate the Prisma client, create the database, seed the demo user, and start the API:

```powershell
npm ci
npm run setup
npm run dev
```

The demo account is `sam@example.com` / `SessionDemo!48`. For local HTTP, set `COOKIE_SECURE="false"`. In production, use HTTPS and set `COOKIE_SECURE="true"`; production startup rejects an insecure cookie configuration. `SESSION_TTL_MS` controls the session lifetime and defaults to one hour.

To seed or refresh the demo account separately after setup, run `npm run db:seed`.

## Endpoint verification

Run these commands from another PowerShell window while the API is running. `curl.exe` avoids PowerShell's `curl` alias.

```powershell
# PowerShell-safe JSON body for curl.exe.
'{"email":"sam@example.com","password":"SessionDemo!48"}' |
  Set-Content -Path login.json -Encoding Ascii -NoNewline

# Login; save the signed sid cookie and inspect its Set-Cookie flags.
curl.exe -i -c cookies.txt -H "Content-Type: application/json" `
  --data-binary "@login.json" http://localhost:3000/auth/login

# Use the saved cookie to retrieve the signed-in identity.
curl.exe -i -b cookies.txt http://localhost:3000/auth/me

# No cookie (or a modified cookie) is rejected.
curl.exe -i http://localhost:3000/auth/me
curl.exe -i -H "Cookie: sid=altered" http://localhost:3000/auth/me

# Logout clears the cookie and deletes the server session.
curl.exe -i -b cookies.txt -c cookies.txt -X POST http://localhost:3000/auth/logout
curl.exe -i -b cookies.txt http://localhost:3000/auth/me

# Remove the local curl test files.
Remove-Item login.json, cookies.txt
```

Login returns a `sid` cookie with `HttpOnly` and `SameSite=Lax`; `Secure` is present when configured for production. Login and `/auth/me` return only the user's `id`, `name`, and `email`. Unknown email and incorrect password share the same `401` response. Logout is idempotent and returns `204`. A Secure cookie is only sent by clients over HTTPS.

## Session storage

Sessions are held in an in-memory `Map` for learning and local execution only. They are not shared across processes and are lost on restart. Production deployments require a shared, expiring server-side store such as Redis.
