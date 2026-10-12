# Database Integration

The API stores posts in PostgreSQL through Prisma. Prisma calls stay inside the repository; the post API continues to return `{ id, title, body, authorId }` records.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and replace the sample `DATABASE_URL` with a local PostgreSQL connection string.
3. Apply the committed initial migration with `npm run db:migrate`.
4. Generate the Prisma Client with `npm run prisma:generate`.
5. Run `npm run db:seed` to add the starter user and posts. The seed does not delete existing data and skips post creation once posts exist.
6. Start the API with `npm start`.

Use `npm run db:deploy` to apply committed migrations in a deployed environment. `npm run db:studio` opens Prisma Studio for inspection. Do not run `prisma migrate reset` against a shared or deployed database; it deletes data.

Never commit `.env` or real credentials. `.env.example` contains only a local placeholder URL.
