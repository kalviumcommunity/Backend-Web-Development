
module.exports = function timing(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const elapsed = Number(process.hrtime.bigint() - start) / 1e6;
    const id = req.id ? `[${req.id.substring(0, 8)}] ` : '';

    console.log(`${id}${req.method} ${req.path} took ${elapsed.toFixed(2)}ms`);
  });

  next();
};
