const { randomBytes } = require('node:crypto');
const { sessionTtlMs } = require('../config/cookieConfig');

const sessions = new Map();

function create(userId) {
  const id = randomBytes(32).toString('base64url');
  const expiresAt = Date.now() + sessionTtlMs;
  sessions.set(id, { userId, expiresAt });
  return { id, expiresAt };
}

function get(id) {
  const session = sessions.get(id);
  if (!session) return null;

  if (session.expiresAt <= Date.now()) {
    sessions.delete(id);
    return null;
  }

  return session;
}

function destroy(id) {
  sessions.delete(id);
}

module.exports = { create, get, destroy };
