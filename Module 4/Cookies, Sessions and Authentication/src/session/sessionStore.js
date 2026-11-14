const { randomBytes } = require('crypto');
const { SESSION_TTL_MS } = require('../config/cookieConfig');

const sessions = new Map();

function createSession(userId) {
  const sessionId = randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_TTL_MS;

  sessions.set(sessionId, {
    userId,
    expiresAt,
  });

  return { sessionId, expiresAt };
}

function getSession(sessionId) {
  if (typeof sessionId !== 'string') return null;

  const session = sessions.get(sessionId);

  if (!session) return null;

  if (session.expiresAt <= Date.now()) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

function destroySession(sessionId) {
  if (typeof sessionId === 'string') {
    sessions.delete(sessionId);
  }
}

module.exports = {
  createSession,
  getSession,
  destroySession,
};
