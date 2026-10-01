/**
 * timing middleware  [mount GLOBALLY in app.js]
 *
 * TODO: export a middleware function (req, res, next) that logs how long the
 *       request took, in milliseconds.
 *   - record a start time at the top (Date.now())
 *   - on the response 'finish' event, log Date.now() - start
 *   - include req.id if it is set
 *   - call next() immediately so the request continues
 *
 * Example line:  [a3f9c1e2] POST /posts took 14ms
 */

module.exports = function timing(req, res, next) {
  // TODO: capture start, register res.on('finish', ...) to log elapsed ms, then next().
  const start = Date.now(); // Record the time when the request enters this middleware

  res.on('finish', () => { // Run this function when the response has finished

    const elapsed = Date.now() - start; // Calculate how many milliseconds the request took

    const id = req.id ? `[${req.id.slice(0, 8)}] ` : ''; // Get first 8 characters of request ID

    console.log(`${id}${req.method} ${req.path} took ${elapsed}ms`); // Log method, path and execution time
  });

  next(); // Continue immediately without waiting for the response
};
