module.exports = function timing(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const elapsedMs = Date.now() - start;
    const shortId = req.id ? `[${req.id.substring(0, 8)}] ` : '';
    console.log(`${shortId}${req.method} ${req.path} took ${elapsedMs}ms`);
  });

  next();
};
