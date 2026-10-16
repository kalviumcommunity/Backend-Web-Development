const sessionStore = require('../session/sessionStore');
const prisma = require('../db/prisma');

async function requireSession(req, res, next) {
  try {
    const sid = req.signedCookies && req.signedCookies.sid;
    if (!sid) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication required' } });
    }
    const session = sessionStore.get(sid);
    if (!session) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication required' } });
    }
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) {
      sessionStore.destroy(sid);
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication required' } });
    }
    req.sessionId = sid;
    req.session = session;
    req.user = { id: user.id, name: user.name, email: user.email };
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = requireSession;

