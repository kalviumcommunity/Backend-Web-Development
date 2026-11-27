const crypto = require('crypto');

const sessions = new Map();
const SESSION_TTL = 24 * 60 * 60 * 1000;

function createSession(userId) {
  const sid = crypto.randomUUID();

  sessions.set(sid, {
    userId,
    expiresAt: Date.now() + SESSION_TTL
  });

  return sid;
}

function getSession(sid) {
  const session = sessions.get(sid);

  if (!session) {
    return null;
  }

  if (Date.now() >= session.expiresAt) {
    sessions.delete(sid);
    return null;
  }

  return session;
}

function destroySession(sid) {
  sessions.delete(sid);
}

module.exports = {
  createSession,
  getSession,
  destroySession,
  _store: sessions
};