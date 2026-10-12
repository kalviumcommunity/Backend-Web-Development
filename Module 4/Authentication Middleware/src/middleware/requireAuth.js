const jwt = require('jsonwebtoken');

const UNAUTHORIZED_BODY = {
  error: {
    code: 'AUTH_REQUIRED',
    message: 'Authentication required',
  },
};

module.exports = function requireAuth(req, res, next) {
  // 1. Read the header; '' means we never work with undefined
  const authHeader = req.headers.authorization ?? '';

  // 2. Enforce the Bearer scheme; no match means token = null
  const match = /^Bearer ([^\s]+)$/i.exec(authHeader);
  const token = match ? match[1] : null;

  // 3. No usable token: reject before any verification
  if (!token) {
    return res.status(401).json(UNAUTHORIZED_BODY);
  }

  // 4. Verify with a server-owned algorithm allowlist
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    req.user = payload; // only after verify succeeds
    return next();
  } catch (_error) {
    // 5. Expired, tampered, malformed: all get the identical response
    return res.status(401).json(UNAUTHORIZED_BODY);
  }
};