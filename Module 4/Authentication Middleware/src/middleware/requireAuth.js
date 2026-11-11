const jwt = require('jsonwebtoken');

/**
 * Express middleware to authenticate requests using a JWT Bearer token.
 * Reads the Authorization header, verifies the token against process.env.JWT_SECRET,
 * attaches the decoded payload to req.user, and guards protected routes.
 */
module.exports = function requireAuth(req, res, next) {
  // 1. Read Authorization header safely
  const authHeader = req.headers.authorization ?? '';

  // 2. Extract Bearer token using strict regex
  const match = /^Bearer ([^\s]+)$/i.exec(authHeader);
  const token = match ? match[1] : null;

  // 3. Return 401 if header is absent, wrong scheme, or token is missing
  if (!token) {
    return res.status(401).json({
      error: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
    });
  }

  // 4. Verify token and attach payload to req.user
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    req.user = payload;
    next();
  } catch (_error) {
    // 5. Generic 401 response for all verification failures
    return res.status(401).json({
      error: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
    });
  }
};
