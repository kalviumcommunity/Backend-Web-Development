/**
 * requestId middleware  [mount GLOBALLY in app.js]
 */

const { randomUUID } = require('crypto');

module.exports = function requestId(req, res, next) {
  req.id = randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
};
