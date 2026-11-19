
/**
 * Middleware factory that checks whether the authenticated
 * user has one of the allowed roles.
 */
module.exports = function requireRole(...allowedRoles) {
  return (req, res, next) => {
    // Check whether the user is authenticated.
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication required',
        },
      });
    }

    // Check whether the user's role is permitted.
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient role',
        },
      });
    }

    // The user is authenticated and has permission.
    return next();
  };
};