'use strict';
// middleware/requireAuth.js — verifies the authorization header and sets req.user
// Given — this is the middleware from LU51.

const { verifyToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({
      error: { code: 'UNAUTHENTICATED', message: 'Authorization credential required' },
    });
  }
  try {
    req.user = verifyToken(match[1]);
    next();
  } catch {
    return res.status(401).json({
      error: { code: 'UNAUTHENTICATED', message: 'Invalid or expired token' },
    });
  }
}

module.exports = requireAuth;
