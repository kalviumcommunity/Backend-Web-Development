const prisma = require('../db/prisma');
const sessionStore = require('../session/sessionStore');

module.exports = function requireSession(req, res, next) {
  const sessionId = req.signedCookies?.sid;
  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
  }

  const session = sessionStore.get(sessionId);
  if (!session) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
  }

  return prisma.user.findUnique({ where: { id: session.userId } })
    .then((user) => {
      if (!user) {
        sessionStore.destroy(sessionId);
        return res.status(401).json({
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      req.user = { id: user.id, name: user.name, email: user.email };
      return next();
    })
    .catch(next);
};
