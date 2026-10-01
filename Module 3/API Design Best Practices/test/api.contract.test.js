const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp, resetData } = require('../src/app');

function parseJson(res) {
  return JSON.parse(res.body || '{}');
}

test('list route returns wrapped data and pagination meta', async () => {
  resetData();
  const app = createApp();
  const server = app.listen(0);

  try {
    const port = server.address().port;
    const res = await fetch(`http://127.0.0.1:${port}/posts?limit=2`);
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(body.data));
    assert.equal(body.data.length, 2);
    assert.equal(body.meta.limit, 2);
    assert.equal(body.meta.total, 5);
    assert.equal(body.meta.nextCursor, 3);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('single post route returns consistent resource envelope', async () => {
  resetData();
  const app = createApp();
  const server = app.listen(0);

  try {
    const port = server.address().port;
    const res = await fetch(`http://127.0.0.1:${port}/posts/1`);
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.ok(body.data);
    assert.equal(body.data.id, 1);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('create route returns resource envelope and 201', async () => {
  resetData();
  const app = createApp();
  const server = app.listen(0);

  try {
    const port = server.address().port;
    const res = await fetch(`http://127.0.0.1:${port}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New post', author: 'lina' })
    });
    const body = await res.json();

    assert.equal(res.status, 201);
    assert.ok(body.data);
    assert.equal(body.data.title, 'New post');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('like route uses resource design and updates likes', async () => {
  resetData();
  const app = createApp();
  const server = app.listen(0);

  try {
    const port = server.address().port;
    const res = await fetch(`http://127.0.0.1:${port}/posts/1/like`, {
      method: 'POST'
    });
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.ok(body.data);
    assert.equal(body.data.likes, 1);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('missing resource returns structured 404', async () => {
  resetData();
  const app = createApp();
  const server = app.listen(0);

  try {
    const port = server.address().port;
    const res = await fetch(`http://127.0.0.1:${port}/posts/9999`);
    const body = await res.json();

    assert.equal(res.status, 404);
    assert.equal(body.error.code, 'POST_NOT_FOUND');
    assert.equal(body.error.message, 'Post not found');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('internal failure returns safe 500 payload', async () => {
  resetData();
  const app = createApp();
  const server = app.listen(0);

  try {
    const port = server.address().port;
    const res = await fetch(`http://127.0.0.1:${port}/internal-error`);
    const body = await res.json();

    assert.equal(res.status, 500);
    assert.equal(body.error.code, 'INTERNAL_SERVER_ERROR');
    assert.equal(body.error.message, 'Something went wrong');
    assert.equal(body.error.details, undefined);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
