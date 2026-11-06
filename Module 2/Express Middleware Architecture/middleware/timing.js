/**
 * timing middleware
 *
 * TODO:
 *  - record the request start time
 *  - on response "finish", compute elapsed milliseconds
 *  - log:
 *      [first8OfReqId] METHOD path took Xms
 *    Example:
 *      [a3f9c1e2] POST /posts took 14ms
 *  - call next() immediately
 */

module.exports = function timing(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const elapsed = Date.now() - start;

    const id = req.id ? `[${req.id.slice(0, 8)}] ` : "";

    console.log(`${id}${req.method} ${req.originalUrl} took ${elapsed}ms`);
  });

  next();
};