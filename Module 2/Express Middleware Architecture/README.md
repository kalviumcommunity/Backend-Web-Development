# Express Middleware Pipeline — Observability Shield

Completed solution for the Kalvium Express Middleware Architecture assignment.

## Run

```bash
npm install
npm start
```

The server listens on `http://localhost:3000`.

## Try the API

```bash
curl -i http://localhost:3000/posts
curl -i -X POST http://localhost:3000/posts -H "Content-Type: application/json" -d "{\"title\":\"Hi\"}"
curl -i http://localhost:3000/users
```

Each response includes an `X-Request-Id` header. The server logs request method/path/status and elapsed time. The `[AUDIT]` message is emitted only for `POST /posts`.

## Files completed

- `middleware/requestId.js`: creates a UUID and attaches it to `req.id` and `X-Request-Id`.
- `middleware/logger.js`: logs method, path, and response status after the response finishes.
- `middleware/timing.js`: logs elapsed milliseconds after the response finishes.
- `app.js`: mounts request ID, logger, and timing globally before the routers.
- `routes/posts.js`: mounts `auditWrite` on POST only.
