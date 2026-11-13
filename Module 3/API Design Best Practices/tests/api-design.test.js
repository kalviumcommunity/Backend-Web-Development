const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp, resetData } = require('../src/app');

async function withServer(fn) {
  const app = createApp();
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();

  try {
    await fn(port);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    resetData();
  }
}

test('public API uses resource-oriented routes and consistent envelopes', async () => {
  await withServer(async (port) => {
    let response = await fetch(`http://localhost:${port}/posts?page=1&limit=2`);
    assert.equal(response.status, 200);
    const list = await response.json();
    assert.ok(Array.isArray(list.data));
    assert.equal(list.meta.page, 1);
    assert.equal(list.meta.limit, 2);
    assert.equal(list.meta.total, 5);
    assert.equal(list.meta.pages, 3);

    response = await fetch(`http://localhost:${port}/posts/1`);
    assert.equal(response.status, 200);
    const single = await response.json();
    assert.equal(single.data.id, 1);
    assert.equal(single.data.title, 'Caching 101');

    response = await fetch(`http://localhost:${port}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Post', author: 'kevin' })
    });
    assert.equal(response.status, 201);
    const created = await response.json();
    assert.equal(created.data.title, 'New Post');
    assert.equal(created.data.author, 'kevin');

    response = await fetch(`http://localhost:${port}/posts/1/likes`, { method: 'POST' });
    assert.equal(response.status, 201);
    const liked = await response.json();
    assert.equal(liked.data.likes, 1);

    response = await fetch(`http://localhost:${port}/posts/999`);
    assert.equal(response.status, 404);
    const missing = await response.json();
    assert.equal(missing.error.code, 'NOT_FOUND');
    assert.equal(missing.error.message, 'Post not found');

    response = await fetch(`http://localhost:${port}/internal-error`);
    assert.equal(response.status, 500);
    const internal = await response.json();
    assert.equal(internal.error.code, 'INTERNAL_ERROR');
    assert.equal(internal.error.message, 'Something went wrong');
    assert.equal(internal.error.cause, undefined);

    const legacy = await fetch(`http://localhost:${port}/getPosts`);
    assert.equal(legacy.status, 404);
  });
});
