const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  // Require the Bearer scheme and a non-empty token.
  const match =
    typeof authHeader === 'string'
      ? authHeader.match(/^Bearer\s+(\S+)$/)
      : null;

  if (!match) {
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required',
      },
    });
  }

  const token = match[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });

    req.user = payload;

    return next();
  } catch (error) {
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required',
      },
    });
  }
}

module.exports = requireAuth;