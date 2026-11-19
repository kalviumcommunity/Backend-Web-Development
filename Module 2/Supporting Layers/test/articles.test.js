const assert = require('node:assert/strict');
const test = require('node:test');
const app = require('../app');

async function withServer(run) {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();

  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

test('lists articles', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/articles`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.ok(Array.isArray(body.data));
  });
});

test('creates and validates articles', async () => {
  await withServer(async (baseUrl) => {
    const invalidResponse = await fetch(`${baseUrl}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '', body: '' })
    });
    assert.equal(invalidResponse.status, 422);

    const response = await fetch(`${baseUrl}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test article', body: 'Test body' })
    });
    assert.equal(response.status, 201);
    const body = await response.json();
    assert.equal(body.data.title, 'Test article');
  });
});

test('updates an article and handles missing articles', async () => {
  await withServer(async (baseUrl) => {
    const updateResponse = await fetch(`${baseUrl}/articles/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated title' })
    });
    assert.equal(updateResponse.status, 200);

    const missingResponse = await fetch(`${baseUrl}/articles/999`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Missing' })
    });
    assert.equal(missingResponse.status, 404);
  });
});
