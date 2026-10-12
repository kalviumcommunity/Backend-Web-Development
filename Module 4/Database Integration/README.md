# Database Integration Assignment

The API persists posts in PostgreSQL through Prisma. The controller and service keep the existing application contract, while the repository is responsible for database access.

## Setup

```bash
npm install
Copy-Item .env.example .env
```

Set `DATABASE_URL` in `.env` to a PostgreSQL database you can access. Do not commit `.env` or real credentials.

## Prepare the database

```bash
npm run prisma:format
npm run prisma:validate
npx prisma migrate dev --name initial_database
npm run prisma:generate
npm run prisma:seed
```

The seed creates or updates demo user ID 1 and the two starter posts, so the post foreign-key relation is valid.

## Start the API

```bash
npm start
```

The API listens on port 3000 by default. Set `PORT` in `.env` to override it.

## Routes

- `GET /posts` lists posts.
- `GET /posts/:id` retrieves a post.
- `POST /posts` creates a post; `title` and an existing `authorId` are required.
- `PATCH /posts/:id` updates a post.
- `DELETE /posts/:id` deletes a post.

Database uniqueness and foreign-key conflicts return a safe `409` response. Missing posts return `404`, and a missing title returns `422`.
