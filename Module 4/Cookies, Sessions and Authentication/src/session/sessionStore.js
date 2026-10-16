const crypto = require('crypto');

const sessions = new Map();

function getTtlMs() {
  return Number(process.env.SESSION_TTL_MS || 3600000);
}

function create(userId) {
  const sid = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + getTtlMs();
  sessions.set(sid, { userId, expiresAt });
  return sid;
}

function get(sid) {
  if (!sid) return undefined;
  const session = sessions.get(sid);
  if (!session) return undefined;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(sid);
    return undefined;
  }
  return session;
}

function destroy(sid) {
  if (!sid) return;
  sessions.delete(sid);
}

module.exports = { create, get, destroy };

