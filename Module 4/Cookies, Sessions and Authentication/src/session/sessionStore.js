const sessions = new Map();

function getTtlMs() {
  const configured = Number(process.env.SESSION_TTL_MS || 60 * 60 * 1000);
  return Number.isFinite(configured) && configured > 0 ? configured : 60 * 60 * 1000;
}

function createSession(sessionId, userId, expiresAt = Date.now() + getTtlMs()) {
  if (!sessionId) return null;

  const session = { userId, expiresAt };
  sessions.set(sessionId, session);
  return session;
}

function getSession(sessionId) {
  if (!sessionId) return null;

  const now = Date.now();

  for (const [id, session] of sessions.entries()) {
    if (session.expiresAt <= now) {
      sessions.delete(id);
    }
  }

  const session = sessions.get(sessionId);
  if (!session) return null;

  if (session.expiresAt <= now) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

function destroySession(sessionId) {
  if (!sessionId) return;
  sessions.delete(sessionId);
}

module.exports = { createSession, getSession, destroySession };
