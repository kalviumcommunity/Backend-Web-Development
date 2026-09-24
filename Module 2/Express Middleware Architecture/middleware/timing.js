/**
 * timing middleware  [mount GLOBALLY in app.js]
 *
 * Logs how long each request took, in milliseconds.
 * Example: [a3f9c1e2] POST /posts took 14ms
 */

module.exports = function timing(req, res, next) {
  // 1. Capture start time
  const start = Date.now();

  // 2. Register callback when response finishes
  res.on("finish", () => {
    const id = req.id ? `[${req.id.slice(0,8)}]` : "";
    const ms = Date.now() - start;
    console.log(`${id} ${req.method} ${req.path} took ${ms}ms`);
  });

  // 3. Let the request continue immediately
  next();
};
