
const jwt = require('jsonwebtoken');

// Implement requireAuth middleware
module.exports = function requireAuth(req, res, next) {
  // Step 1: Read Authorization header
  const authHeader = req.headers.authorization ?? '';

  // Step 2: Extract Bearer token using strict regex
  const match = /^Bearer ([^\s]+)$/i.exec(authHeader);
  const token = match ? match[1] : null;

  // Step 3: Return 401 if token is missing or invalid format
  if (!token) {
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required'
      }
    });
  }

  // Step 4: Verify JWT
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });

    // Attach verified payload to request
    req.user = payload;

    // Continue to protected route
    next();

  } catch (_error) {
    // Same response for every verification failure
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required'
      }
    });
  }
};
