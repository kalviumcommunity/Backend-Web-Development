
const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
  // 1. Read Authorization header
  const authHeader = req.headers.authorization ?? '';

  // 2. Extract Bearer token using strict regex
  const match = authHeader.match(/^Bearer ([^\s]+)$/i);
  const token = match ? match[1] : null;

  // 3. Return 401 if token is missing or invalid
  if (token === null) {
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required'
      }
    });
  }

  // 4. Verify JWT
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    // Attach verified payload
    req.user = payload;

    // Continue to protected route
    return next();

  } catch (error) {
    // 5. Same generic error for every token failure
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required'
      }
    });
  }
};
