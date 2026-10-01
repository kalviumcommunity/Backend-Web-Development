/**
 * timing middleware  [mount GLOBALLY in app.js]
 *
 * Logs:
 *   [requestId] METHOD PATH took Xms
 * Example:
 *   [a3f9c1e2] POST /posts took 14ms
 */

module.exports = function timing(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - start;
    const id = req.id ? `[${req.id.slice(0, 8)}]` : '';

    console.log(
      `${id} ${req.method} ${req.originalUrl} took ${ms}ms`.trim()
    );
  });

  next();
};