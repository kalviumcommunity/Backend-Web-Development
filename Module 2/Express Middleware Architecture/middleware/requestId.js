const crypto = require("crypto");

function requestId(req, res, next) {
  const id = crypto.randomUUID();

  req.id = id;
  res.setHeader("X-Request-Id", id);

  next();
}

module.exports = requestId;