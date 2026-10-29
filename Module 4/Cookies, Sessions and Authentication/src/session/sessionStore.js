const { randomBytes } = require('node:crypto');

const sessions = new Map();
const configuredTtl = Number(process.env.SESSION_TTL_MS);
const SESSION_TTL_MS = Number.isFinite(configuredTtl) && configuredTtl > 0
  ? configuredTtl
  : 60 * 60 * 1000;

function create(userId) {
  const sessionId = randomBytes(32).toString('hex');
  sessions.set(sessionId, {
    userId,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
  return sessionId;
}

function get(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  if (session.expiresAt <= Date.now()) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

function destroy(sessionId) {
  sessions.delete(sessionId);
}

module.exports = { create, get, destroy, SESSION_TTL_MS };
