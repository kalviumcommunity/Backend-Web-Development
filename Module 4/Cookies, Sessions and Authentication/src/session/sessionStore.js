
const crypto = require('crypto');

const sessions = new Map();

const SESSION_DURATION_MS = Number(process.env.SESSION_TTL_MS || 3600000);

function create(userId) {
    const id = crypto.randomUUID();

    const session = {
        userId,
        expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    sessions.set(id, session);

    return { id, ...session };
}

function get(id) {
    if (!id) {
        return null;
    }

    const session = sessions.get(id);

    if (!session) {
        return null;
    }

    if (Date.now() >= session.expiresAt) {
        sessions.delete(id);
        return null;
    }

    return session;
}

function destroy(id) {
    if (id) {
        sessions.delete(id);
    }
}

module.exports = {
    create,
    get,
    destroy,
};
