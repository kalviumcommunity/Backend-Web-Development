const assert = require('node:assert/strict');
const test = require('node:test');
const bcrypt = require('bcryptjs');

process.env.COOKIE_SECRET = 'test-secret-with-more-than-thirty-two-characters';
process.env.COOKIE_SECURE = 'false';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';

const app = require('../src/app');
const prisma = require('../src/db/prisma');
const sessionStore = require('../src/session/sessionStore');

const demoUser = {
  id: 1,
  name: 'Sam',
  email: 'sam@example.com',
  passwordHash: '',
};

prisma.user.findUnique = async ({ where, select }) => {
  const found = where.id === demoUser.id || where.email === demoUser.email;
  if (!found) return null;
  if (!select) return demoUser;

  return Object.keys(select).reduce((user, field) => {
    user[field] = demoUser[field];
    return user;
  }, {});
};

test('session store expires and destroys sessions', async () => {
  const sessionId = sessionStore.create(45, 1);
  const session = sessionStore.get(sessionId);
  assert.equal(session.userId, 45);
  assert.ok(session.expiresAt > Date.now());

  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(sessionStore.get(sessionId), undefined);

  const activeSessionId = sessionStore.create(46);
  assert.equal(sessionStore.destroy(activeSessionId), true);
  assert.equal(sessionStore.get(activeSessionId), undefined);
});

test('login, protected identity, and logout use the signed server session', async () => {
  demoUser.passwordHash = await bcrypt.hash('SessionDemo!48', 4);
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  try {
    const unauthenticated = await fetch(`${baseUrl}/auth/me`);
    assert.equal(unauthenticated.status, 401);

    const invalidLogin = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: demoUser.email, password: 'wrong-password' }),
    });
    assert.equal(invalidLogin.status, 401);
    assert.equal((await invalidLogin.json()).error.code, 'INVALID_CREDENTIALS');

    const login = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ' SAM@example.com ', password: 'SessionDemo!48' }),
    });
    assert.equal(login.status, 200);
    assert.deepEqual(await login.json(), {
      user: { id: demoUser.id, name: demoUser.name, email: demoUser.email },
    });

    const setCookie = login.headers.get('set-cookie');
    assert.match(setCookie, /HttpOnly/i);
    assert.match(setCookie, /SameSite=Lax/i);
    const cookie = setCookie.split(';', 1)[0];

    const identity = await fetch(`${baseUrl}/auth/me`, { headers: { Cookie: cookie } });
    assert.equal(identity.status, 200);
    assert.deepEqual(await identity.json(), {
      user: { id: demoUser.id, name: demoUser.name, email: demoUser.email },
    });

    const tamperedCookie = `${cookie.slice(0, -1)}${cookie.endsWith('a') ? 'b' : 'a'}`;
    const tamperedIdentity = await fetch(`${baseUrl}/auth/me`, {
      headers: { Cookie: tamperedCookie },
    });
    assert.equal(tamperedIdentity.status, 401);

    const logout = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { Cookie: cookie },
    });
    assert.equal(logout.status, 204);
    assert.match(logout.headers.get('set-cookie'), /Expires=Thu, 01 Jan 1970/i);

    const afterLogout = await fetch(`${baseUrl}/auth/me`, { headers: { Cookie: cookie } });
    assert.equal(afterLogout.status, 401);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
});
