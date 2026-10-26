
const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
  // Step 1: Read the Authorization header
  const authHeader = req.headers.authorization ?? '';

  // Step 2: Extract the Bearer token
  const match = /^Bearer ([^\s]+)$/i.exec(authHeader);
  const token = match ? match[1] : null;

  // Step 3: Reject requests without a usable token
  if (!token) {
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required'
      }
    });
  }

  // Step 4: Verify the token
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    // Step 5: Attach verified identity and continue
    req.user = payload;
    return next();
  } catch (_error) {
    // Return the same response for every verification failure
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required'
      }
    });
  }
};
