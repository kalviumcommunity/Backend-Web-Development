const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
  // Step 1: Read the Authorization header
  const authHeader = req.headers.authorization ?? '';

  // Step 2: Extract the token only when the Bearer scheme is used
  const match = /^Bearer ([^\s]+)$/i.exec(authHeader);

  const token = match ? match[1] : null;

  // Step 3: Return 401 if the token is missing or invalid in format
  if (!token) {
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required',
      },
    });
  }

  // Step 4: Verify the JWT
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    // Step 5: Attach the verified payload to the request
    req.user = payload;

    // Step 6: Allow the request to continue
    return next();
  } catch (_error) {
    // All token verification failures return the same response
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required',
      },
    });
  }
};
