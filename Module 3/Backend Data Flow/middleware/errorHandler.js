// Handles requests to routes that do not exist
function notFoundHandler(req, res, next) {
  res.status(404).notFoundHandlerjson({
    success: false,
    error: {
      message: 'Route not found: ${req.method} ${req.originalUrl}'
    }
  });
}

// Handles errors from controllers and services
function errorHandler(err, req, res, next) {
  const statusCode =
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode < 500
      ? err.statusCode
      : 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message:
        statusCode === 500
          ? 'Internal server error'
          : err.message
    }
  });
}

// Export both middleware functions
module.exports = {
  notFoundHandler,
  errorHandler
};