// Role-based authorization middleware factory.
// Authentication is handled earlier by requireAuth; this middleware only
// decides whether the authenticated user's trusted role is allowed.
module.exports = function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: { code: 'UNAUTHENTICATED', message: 'Authentication required' },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Insufficient role' },
      });
    }

    return next();
  };
};
