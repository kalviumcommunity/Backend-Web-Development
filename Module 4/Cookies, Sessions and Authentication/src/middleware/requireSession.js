const prisma = require('../db/prisma');
const sessionStore = require('../session/sessionStore');

function unauthorized(res) {
  return res.status(401).json({
    error: { code: 'UNAUTHENTICATED', message: 'Authentication required' },
  });
}

module.exports = async function requireSession(req, res, next) {
  const sessionId = req.signedCookies && req.signedCookies.sid;
  if (typeof sessionId !== 'string') return unauthorized(res);

  const session = sessionStore.get(sessionId);
  if (!session) return unauthorized(res);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true },
  });
  if (!user) {
    sessionStore.destroy(sessionId);
    return unauthorized(res);
  }

  req.user = user;
  return next();
};
