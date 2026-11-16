require('dotenv').config();
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./test.db';
require('child_process').execFileSync(process.execPath, [
  require.resolve('prisma/build/index.js'),
  'db',
  'push',
], { env: process.env, stdio: 'inherit' });
const assert = require('assert');
const http = require('http');
const app = require('../src/app');
const prisma = require('../src/db');

function request(server, path, body) {
  return new Promise((resolve, reject) => {
    const request = http.request({
      hostname: '127.0.0.1', port: server.address().port, path, method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => resolve({ status: response.statusCode, body: JSON.parse(data) }));
    });
    request.on('error', reject);
    request.end(JSON.stringify(body));
  });
}

async function run() {
  await prisma.user.deleteMany();
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const registered = await request(server, '/auth/register', {
      name: 'Sam', email: ' SAM@example.com ', password: 'correct horse battery staple',
    });
    assert.strictEqual(registered.status, 201);
    assert.deepStrictEqual(Object.keys(registered.body).sort(), ['email', 'id', 'name']);
    assert.strictEqual(registered.body.email, 'sam@example.com');

    const duplicate = await request(server, '/auth/register', {
      name: 'Other', email: 'sam@example.com', password: 'another password',
    });
    assert.strictEqual(duplicate.status, 409);

    const wrong = await request(server, '/auth/login', {
      email: 'sam@example.com', password: 'wrong password',
    });
    const unknown = await request(server, '/auth/login', {
      email: 'unknown@example.com', password: 'wrong password',
    });
    assert.strictEqual(wrong.status, 401);
    assert.deepStrictEqual(wrong.body, unknown.body);

    const loggedIn = await request(server, '/auth/login', {
      email: ' SAM@EXAMPLE.COM ', password: 'correct horse battery staple',
    });
    assert.strictEqual(loggedIn.status, 200);
    assert.deepStrictEqual(loggedIn.body, registered.body);
    assert.strictEqual((await request(server, '/auth/login', { email: '', password: 'x' })).status, 400);
    console.log('All authentication tests passed.');
  } finally {
    await prisma.$disconnect();
    server.close();
  }
}

run().catch((error) => {
  console.error('Test failure:', error.message);
  process.exitCode = 1;
});
