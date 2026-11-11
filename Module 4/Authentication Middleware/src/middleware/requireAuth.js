const jwt = require('jsonwebtoken');

/**
 * Protects a route by requiring a valid JWT Bearer token.
 * On success, exposes the verified token payload as req.user.
 * All authentication failures use the same generic 401 response.
 */
module.exports = function requireAuth(req, res, next) {
  // Accept only the Bearer scheme and a non-empty token.
  const authHeader = req.headers.authorization ?? '';
  const match = /^Bearer ([^\\s]+)$/i.exec(authHeader);
  const token = match ? match[1] : null;

  if (!token) {
    return res.status(401).json({
      error: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
    });
  }

  try {
    // Restrict verification to the algorithm used by this application.
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });

    // Attach identity only after the signature and claims are verified.
    req.user = payload;
    return next();
  } catch (_error) {
    return res.status(401).json({
      error: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
    });
  }
};
