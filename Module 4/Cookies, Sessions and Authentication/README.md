# LU48 — Cookies, Sessions and Authentication

Session-based authentication API built with Express, Prisma, SQLite, and bcrypt.

## Features

- Login with email and password.
- Password verification using bcrypt.
- Cryptographically random opaque session IDs.
- Signed HTTP-only sid cookies.
- Server-side session storage with expiration.
- Protected GET /auth/me endpoint.
- Logout destroys the session and clears the cookie.
- Generic authentication errors and safe user responses.

## Setup

1. Install dependencies:

   npm install

2. Copy the example environment file:

   cp .env.example .env

3. Edit .env and set COOKIE_SECRET to a random secret of at least 32 characters.

4. For local HTTP development, use COOKIE_SECURE=false.
   In production, use HTTPS and COOKIE_SECURE=true.

5. Initialize the database and seed the demo user:

   npm run setup

6. Start the server:

   npm run dev

The default port is 3000. Change PORT in .env if that port is already occupied.

## Demo Account

Email: sam@example.com

Password: SessionDemo!48

## API Endpoints

### POST /auth/login

Authenticates a user and creates a server-side session. Returns a safe user object and sets a signed sid cookie.

### GET /auth/me

Returns the authenticated user's identity. Requires a valid session cookie.

### POST /auth/logout

Destroys the current session and clears the sid cookie. Returns 204 No Content.

## Testing

Use curl to test the login, profile, and logout endpoints. Save the login cookie using the -c option and send it with -b on subsequent requests.

Example:

curl -i -c cookies.txt -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"sam@example.com","password":"SessionDemo!48"}'

curl -i -b cookies.txt http://localhost:3000/auth/me

curl -i -b cookies.txt -X POST http://localhost:3000/auth/logout

## Session Storage

Sessions are stored in an in-memory Map for this learning project. Expired sessions are removed when accessed, and sessions are destroyed on logout.

In-memory sessions are lost when the server restarts and are not shared between server instances. Production deployments should use a shared expiring session store such as Redis.

## Security

- Passwords are verified using bcrypt.
- Session IDs are generated using cryptographically secure random bytes.
- Cookies are signed, HTTP-only, and SameSite=Lax.
- Production cookies use the Secure flag.
- Password hashes and session IDs are not included in user API responses.
- Authentication failures use generic error messages.
