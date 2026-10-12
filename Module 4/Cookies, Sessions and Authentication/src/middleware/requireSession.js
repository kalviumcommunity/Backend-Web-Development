const sessionStore = require('../session/sessionStore');
const prisma = require('../db/prisma');

module.exports = async function requireSession(req, res, next) {
  try {
    const sessionId = req.signedCookies?.sid;
    if (!sessionId) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
    }

    const session = sessionStore.getSession(sessionId);
    if (!session) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      sessionStore.destroySession(sessionId);
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};
