const crypto = require('node:crypto');
const { sessionTtlMs } = require('../config/sessionConfig');

class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  create(userId) {
    const id = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + sessionTtlMs);
    this.sessions.set(id, { userId, expiresAt });
    return { id, expiresAt };
  }

  get(id) {
    const session = this.sessions.get(id);
    if (!session) return null;

    if (session.expiresAt.getTime() <= Date.now()) {
      this.destroy(id);
      return null;
    }

    return session;
  }

  destroy(id) {
    this.sessions.delete(id);
  }
}

module.exports = new SessionStore();
