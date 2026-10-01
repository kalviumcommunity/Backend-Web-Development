/**
 * asyncHandler — wraps an async route handler
 *
 * If the handler rejects, the promise rejection is passed to next(err)
 * so the error handler middleware can process it.
 */

module.exports = function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
