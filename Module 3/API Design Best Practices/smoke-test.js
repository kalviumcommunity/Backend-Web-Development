const assert = require('node:assert/strict');
const { createApp, resetData } = require('./src/app');

async function request(server, path, options = {}) {
  const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`, {
    headers: { 'content-type': 'application/json' },
    ...options
  });
  return { status: response.status, body: await response.json() };
}

(async () => {
  resetData();
  const server = createApp().listen(0);
  try {
    let result = await request(server, '/posts');
    assert.equal(result.status, 200);
    assert.deepEqual(Object.keys(result.body), ['data', 'meta']);
    assert.equal(result.body.data.length, 2);
    assert.deepEqual(result.body.meta, { page: 1, limit: 2, total: 5, pages: 3 });

    result = await request(server, '/posts/1');
    assert.equal(result.status, 200);
    assert.equal(result.body.data.id, 1);

    result = await request(server, '/posts', {
      method: 'POST',
      body: JSON.stringify({ title: 'Safe contracts', author: 'lee' })
    });
    assert.equal(result.status, 201);
    assert.equal(result.body.data.title, 'Safe contracts');

    result = await request(server, '/posts/1/likes', { method: 'POST' });
    assert.equal(result.status, 200);
    assert.equal(result.body.data.likes, 1);

    result = await request(server, '/posts/999');
    assert.equal(result.status, 404);
    assert.deepEqual(result.body, { error: { code: 'NOT_FOUND', message: 'Post not found' } });

    result = await request(server, '/posts/1/likes', { method: 'POST' });
    assert.equal(result.status, 200);

    result = await request(server, '/posts/1', { method: 'POST' });
    assert.equal(result.status, 404);

    result = await request(server, '/posts?limit=1000000');
    assert.equal(result.body.meta.limit, 100);

    result = await request(server, '/explode');
    assert.equal(result.status, 500);
    assert.deepEqual(result.body, { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } });
    assert.equal(JSON.stringify(result.body).includes('SQLITE'), false);
    assert.equal(JSON.stringify(result.body).includes('stack'), false);

    console.log('API contract smoke tests passed');
  } finally {
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
