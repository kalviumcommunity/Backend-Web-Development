// requireRole(...allowedRoles) returns an Express middleware.
// - 401 UNAUTHENTICATED if req.user is missing
// - 403 FORBIDDEN if req.user.role is not in allowedRoles
// - otherwise calls next()
// The role is read ONLY from req.user.role (set by requireAuth).

module.exports = function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: { code: 'UNAUTHENTICATED', message: 'Authentication required' },
      });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to do this' },
      });
    }
    return next();
  };
};