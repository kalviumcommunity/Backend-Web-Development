module.exports = function timing(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const elapsed = Date.now() - start;
    const id = req.id ? `[${req.id}] ` : '';

    console.log(`${id}${req.method} ${req.path} took ${elapsed}ms`);
  });

  next();
};