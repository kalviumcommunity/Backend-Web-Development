const crypto = require('crypto');
const { sessionTtlMs } = require('../config/cookieConfig');

// In-memory store: for learning/local use only.
// Production needs a shared expiring store such as Redis.
const sessions = new Map();

function create(userId) {
  const id = crypto.randomUUID();
  sessions.set(id, { userId, expiresAt: Date.now() + sessionTtlMs() });
  return id;
}

function get(id) {
  if (typeof id !== 'string') return null;
  const session = sessions.get(id);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(id);
    return null;
  }
  return session;
}

function destroy(id) {
  if (typeof id === 'string') sessions.delete(id);
}

module.exports = { create, get, destroy };