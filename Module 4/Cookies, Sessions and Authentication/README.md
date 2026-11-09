
# LU48 - Session-Based Authentication

Express and Prisma API implementing server-side session authentication using signed HTTP-only cookies.

## Requirements

- Node.js
- npm
- SQLite (configured through Prisma)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell, you can use:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Set `COOKIE_SECRET` in `.env` to a random secret containing at least 32 characters.

4. Configure the environment:

   ```env
   DATABASE_URL="file:./dev.db"
   COOKIE_SECRET="your-random-secret-at-least-32-characters"
   COOKIE_SECURE="false"
   SESSION_TTL_MS="3600000"
   PORT="3000"
   ```

5. Generate Prisma Client, create the database, and seed the demo user:

   ```bash
   npm run setup
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

The API runs at `http://localhost:3000`.

## Demo account

- Email: `sam@example.com`
- Password: `SessionDemo!48`

## Authentication endpoints

### POST /auth/login

Authenticates a user using email and password.

- Validates and normalizes the email.
- Compares the password using bcrypt.
- Generates a cryptographically random session ID.
- Stores the user ID and expiration time on the server.
- Sends the opaque session ID in a signed HTTP-only cookie.
- Returns safe user details without the password hash.

### GET /auth/me

Protected endpoint.

- Reads and verifies the signed session cookie.
- Retrieves the session from the server-side session store.
- Checks expiration and confirms that the user still exists.
- Returns the authenticated user's safe details.

### POST /auth/logout

- Destroys the server-side session.
- Clears the session cookie.
- Returns HTTP 204 No Content.

## Cookie configuration

The session cookie is named `sid` and uses:

- `httpOnly: true`
- `sameSite: lax`
- `secure: true` in production
- `signed: true`
- `path: /`
- Configurable expiration using `SESSION_TTL_MS`

Use HTTPS in production.

## Session storage

The current implementation uses an in-memory Map for local development.

Sessions are lost when the server restarts. For production or multiple server instances, replace the in-memory store with a shared store such as Redis.

## Project structure

```text
src/
  app.js
  config/
    cookie.js
  db/
    prisma.js
  middleware/
    requireSession.js
  repositories/
    userRepository.js
  routes/
    authRoutes.js
  session/
    sessionStore.js

prisma/
  schema.prisma
  seed.js
```

## Security notes

- Never commit `.env` or real secrets.
- Passwords are compared using bcrypt.
- Session identifiers are generated using Node.js crypto.
- Password hashes are never included in API responses.
- Invalid, expired, and missing sessions receive HTTP 401.
