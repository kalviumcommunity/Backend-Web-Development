const crypto = require('node:crypto');
const { sessionTtlMs } = require('../authConfig');

const sessions = new Map();

function create(userId) {
  const id = crypto.randomUUID();
  const session = {
    userId,
    expiresAt: new Date(Date.now() + sessionTtlMs),
  };
  sessions.set(id, session);
  return { id, ...session };
}

function get(id) {
  if (!id || typeof id !== 'string') return undefined;

  const session = sessions.get(id);
  if (!session) return undefined;
  if (session.expiresAt.getTime() <= Date.now()) {
    sessions.delete(id);
    return undefined;
  }
  return session;
}

function destroy(id) {
  if (id) sessions.delete(id);
}

module.exports = { create, get, destroy };
