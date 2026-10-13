const crypto = require('crypto');

const sessions = new Map();
const SESSION_TTL_MS = 60 * 60 * 1000;

function pruneExpired(now = Date.now()) {
  for (const [sessionId, session] of sessions.entries()) {
    if (session.expiresAt <= now) {
      sessions.delete(sessionId);
    }
  }
}

function create(userId) {
  pruneExpired();

  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const session = { userId, expiresAt };

  sessions.set(sessionId, session);
  return { id: sessionId, userId, expiresAt };
}

function get(sessionId) {
  if (!sessionId) return null;

  pruneExpired();

  const session = sessions.get(sessionId);
  if (!session) return null;

  if (session.expiresAt <= Date.now()) {
    sessions.delete(sessionId);
    return null;
  }

  return { ...session };
}

function destroy(sessionId) {
  if (!sessionId) return false;

  return sessions.delete(sessionId);
}

module.exports = {
  create,
  get,
  destroy,
  sessions,
  SESSION_TTL_MS,
};
