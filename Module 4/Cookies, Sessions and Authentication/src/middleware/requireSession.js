const { sessions } = require('../data');

module.exports = function requireSession(req, res, next) {
  const sid = req.signedCookies?.sid;

  if (!sid || !sessions.has(sid)) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication required'
      }
    });
  }

  const session = sessions.get(sid);

  req.user = session.user;

  next();
};