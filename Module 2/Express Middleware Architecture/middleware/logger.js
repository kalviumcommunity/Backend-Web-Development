/**
 * logger middleware  [mount GLOBALLY in app.js]
 *
 * Logs:
 *   [requestId] METHOD PATH STATUS
 * Example:
 *   [a3f9c1e2] POST /posts 201
 */

module.exports = function logger(req, res, next) {
  res.on('finish', () => {
    const id = req.id ? `[${req.id.slice(0, 8)}]` : '';

    console.log(
      `${id} ${req.method} ${req.originalUrl} ${res.statusCode}`.trim()
    );
  });

  next();
};