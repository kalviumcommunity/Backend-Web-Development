const crypto = require("crypto");

const sessions = new Map();

const SESSION_TTL_MS = Number(
  process.env.SESSION_TTL_MS || 3600000
);

function create(userId) {
  const sessionId = crypto.randomBytes(32).toString("hex");

  const session = {
    userId,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };

  sessions.set(sessionId, session);

  return { sessionId, session };
}

function get(sessionId) {
  if (!sessionId || typeof sessionId !== "string") {
    return null;
  }

  const session = sessions.get(sessionId);

  if (!session) {
    return null;
  }

  if (session.expiresAt <= Date.now()) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

function destroy(sessionId) {
  if (typeof sessionId === "string") {
    sessions.delete(sessionId);
  }
}

module.exports = { create, get, destroy };
