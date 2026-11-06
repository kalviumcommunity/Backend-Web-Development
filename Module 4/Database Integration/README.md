# Database Integration Assignment

The posts API stores data in PostgreSQL through Prisma. Prisma is used only by the repository and the seed script; services and controllers keep the existing asynchronous repository contract.

## Local setup

Run these commands from this project folder (`Module 4/Database Integration`):

```powershell
npm install
Copy-Item .env.example .env
```

Edit `.env` and set `DATABASE_URL` to a PostgreSQL database dedicated to this project. For a local PostgreSQL server, use a URL such as:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/community_dev?schema=public"
PORT=3000
```

Create the `community_dev` database once if it does not exist. Do not commit `.env`; `.env.example` contains placeholders only.

## Migrations and starter data

The committed migration is the database history. Apply it and generate the client with:

```powershell
npm run prisma:migrate -- --name initial_community_schema
npm run prisma:generate
npm run prisma:seed
```

The seed is repeatable: it upserts the starter author and the two posts shown by the original in-memory repository. It does not drop tables or clear existing data. Use a dedicated development database before running it.

## Run the API

```powershell
npm start
```

The existing routes are `GET /posts`, `GET /posts/:id`, `POST /posts`, `PATCH /posts/:id`, and `DELETE /posts/:id`. Create requests may include `title`, `body`, and `authorId`; omitting `authorId` remains supported.

## Repository contract

- `findAll()` resolves to an array, including an empty array when there are no posts.
- `findById(id)` resolves to a post or `null`.
- `create(fields)` resolves to the complete created post.
- `update(id, patch)` resolves to the updated post or `null` for an unknown ID.
- `remove(id)` resolves to `true` when it deletes a post and `false` when no post matches.

Database constraint errors are translated to generic API errors; raw Prisma/database details are not sent to clients.
