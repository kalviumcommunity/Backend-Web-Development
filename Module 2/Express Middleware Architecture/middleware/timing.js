module.exports = function timing(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - start;

    console.log(
      `[${req.id || "-"}] ${req.method} ${req.path} took ${ms}ms`
    );
  });

  next();
};