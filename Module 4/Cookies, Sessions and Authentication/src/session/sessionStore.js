const crypto = require('crypto');

const sessions = new Map();

const SESSION_TTL = 24 * 60 * 60 * 1000;

function create(userId) {
  // TODO: implement create/get/destroy around an in-memory Map.
  // Store opaque session id -> { userId, expiresAt }, never credentials.
  // Remove expired sessions during reads.

  const sessionId = crypto.randomBytes(32).toString('hex');

  const expiresAt = Date.now() + SESSION_TTL;

  sessions.set(sessionId, {
    userId,
    expiresAt
  });

  return {
    sessionId,
    expiresAt
  };
}

function get(sessionId) {
  if (!sessionId || typeof sessionId !== 'string') {
    return null;
  }

  const session = sessions.get(sessionId);

  if (!session) {
    return null;
  }

  if (Date.now() >= session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

function destroy(sessionId) {
  if (!sessionId || typeof sessionId !== 'string') {
    return false;
  }

  return sessions.delete(sessionId);
}

module.exports = {
  create,
  get,
  destroy
};