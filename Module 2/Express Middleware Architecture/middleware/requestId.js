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

// Define and export the middleware
module.exports = function requestId(req, res, next) {
  // TODO: implement the four steps described above.
  const id = randomUUID(); // Generate a unique ID for this request

  req.id = id; // Store the ID in req.id so other middleware can access it

  res.setHeader('X-Request-Id', id); // Send the same ID to the client in the response header

  next(); // Move the request to the next middleware or route
};
