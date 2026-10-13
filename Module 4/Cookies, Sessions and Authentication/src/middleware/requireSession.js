const prisma = require('../db/prisma');
const sessionStore = require('../session/sessionStore');

const AUTH_REQUIRED = {
  error: {
    code: 'AUTH_REQUIRED',
    message: 'Authentication required',
  },
};

// TODO: read req.signedCookies.sid, resolve the server session,
// attach identity to the request, and return generic 401 when invalid.
module.exports = async function requireSession(req, res, next) {
  try {
    const sid = req.signedCookies?.sid;
    const session = sid ? sessionStore.get(sid) : null;

    if (!session) {
      return res.status(401).json(AUTH_REQUIRED);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      sessionStore.destroy(sid);
      return res.status(401).json(AUTH_REQUIRED);
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error('[requireSession]', error.message);
    return res.status(401).json(AUTH_REQUIRED);
  }
};
