// TODO: read req.signedCookies.sid, resolve the server session,
// attach identity to the request, and return generic 401 when invalid.

const sessionStore = require('./sessionStore');

module.exports = function requireSession(req, res, next) {
  try {
    const sessionId = req.signedCookies?.sid;

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    const session = sessionStore.get(sessionId);

    if (!session) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    // Attach the authenticated identity to the request.
    req.user = {
      id: session.userId
    };

    req.sessionId = sessionId;

    next();
  } catch (err) {
    next(err);
  }
};