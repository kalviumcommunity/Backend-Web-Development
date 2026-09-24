/**
 * logger middleware  [mount GLOBALLY in app.js]
 *
 * Logs METHOD, PATH, STATUS once the response finishes.
 * Includes req.id if set by requestId middleware.
 * Example: [a3f9c1e2] POST /posts 201
 */

module.exports = function logger(req, res, next) {
  // Register a callback when the response is finished
  res.on("finish", () => {
    const id = req.id ? `[${req.id.slice(0,8)}]` : "";
    console.log(`${id} ${req.method} ${req.path} ${res.statusCode}`);
  });

  // Let the request continue immediately
  next();
};
