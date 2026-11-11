# Kalvium Backend

A simple Express.js REST API for managing books, using MongoDB (Mongoose).

## Setup

```bash
npm install
npm run dev   # development (auto-reload)
npm start     # production
```

Requires MongoDB running locally, or set `MONGO_URI` in `.env`.

## Endpoints

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | /api/books        | List all books     |
| GET    | /api/books/:id    | Get one book       |
| POST   | /api/books        | Create a book      |
| PUT    | /api/books/:id    | Update a book      |
| DELETE | /api/books/:id    | Delete a book      |

## Example request

```json
POST /api/books
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "genre": "Fiction",
  "year": 1988
}
```
