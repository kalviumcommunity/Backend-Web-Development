const jwt = require('jsonwebtoken');


module.exports = function requireAuth(req, res, next) {
  // Read the Authorization header
  const authHeader = req.headers.authorization ?? '';


  // Extract the Bearer token
  const match = /^Bearer ([^\s]+)$/i.exec(authHeader);
  const token = match ? match[1] : null;


  // Return 401 if the token is missing or invalid in format
  if (!token) {
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required'
      }
    });
  }


  // Verify the token
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });


    // Attach the verified payload to the request
    req.user = payload;


    // Continue to the route handler
    next();
  } catch (_error) {
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required'
      }
    });
  }
};