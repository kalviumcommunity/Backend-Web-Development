/**
 * requestId middleware  [mount GLOBALLY in app.js]
 *
 * TODO: export a middleware function (req, res, next) that:
 *   - generates a UUID with crypto.randomUUID()
 *   - attaches it to req.id            (so later middleware/handlers can read it)
 *   - sets it as the "X-Request-Id" response header
 *   - calls next() so the request continues down the pipeline
 */

const { randomUUID } = require('crypto');

module.exports = function requestId(req, res, next) {
  // TODO: implement the four steps described above
  const id = randomUUID();
  //storethe id in the request.
  req.id = id;
  //send th ei d in the response header.
  res.setHeader('X-Request-Id', id);

  //move to the next middleware.
  next();
};
