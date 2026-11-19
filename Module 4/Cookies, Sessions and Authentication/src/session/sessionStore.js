const { randomBytes } = require('node:crypto');

const DEFAULT_SESSION_TTL_MS = 60 * 60 * 1000;
const sessionTtlMs = process.env.SESSION_TTL_MS === undefined
  ? DEFAULT_SESSION_TTL_MS
  : Number(process.env.SESSION_TTL_MS);

if (!Number.isFinite(sessionTtlMs) || sessionTtlMs <= 0) {
  throw new Error('SESSION_TTL_MS must be a positive number');
}

const sessions = new Map();

function create(userId, ttlMs = sessionTtlMs) {
  if (userId === undefined || userId === null) {
    throw new TypeError('A userId is required to create a session');
  }
  if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
    throw new RangeError('Session TTL must be a positive number');
  }

  let sessionId;
  do {
    sessionId = randomBytes(32).toString('hex');
  } while (sessions.has(sessionId));

  sessions.set(sessionId, {
    userId,
    expiresAt: Date.now() + ttlMs,
  });

  return sessionId;
}

function get(sessionId) {
  if (typeof sessionId !== 'string') return undefined;

  const session = sessions.get(sessionId);
  if (!session) return undefined;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(sessionId);
    return undefined;
  }

  return { ...session };
}

function destroy(sessionId) {
  return sessions.delete(sessionId);
}

module.exports = { create, get, destroy, ttlMs: sessionTtlMs };
