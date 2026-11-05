# Database Integration — Prisma + PostgreSQL

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set your local PostgreSQL credentials in `DATABASE_URL`.

3. Format and validate the schema:

   ```bash
   npm run prisma:format
   npm run prisma:validate
   ```

4. Create and apply the named migration and generate Prisma Client:

   ```bash
   npx prisma migrate dev --name community_relations
   npx prisma generate
   ```

5. Optionally insert demo user and posts:

   ```bash
   npm run db:seed
   ```

6. Start the API:

   ```bash
   npm start
   ```

## Existing Posts API contract

- `GET /posts` returns `{ "data": [...] }`.
- `GET /posts/:id` returns `{ "data": post }`, or 404 `{ "error": "Post not found" }`.
- `POST /posts` returns 201 `{ "data": post }`; missing title returns 422.
- `PATCH /posts/:id` returns `{ "data": post }`, or 404.
- `DELETE /posts/:id` returns 204, or 404.

Post response fields remain `id`, `title`, `body`, and `authorId`. Prisma stays inside the repository and shared database module, not in services or controllers.

Known database constraint failures are translated to safe 409/422 responses. Unexpected errors return a generic 500 response.

Never commit `.env`. Commit `.env.example` only.
