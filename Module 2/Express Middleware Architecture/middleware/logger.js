module.exports = function logger(req, res, next) {
  res.on('finish', () => {
    const id = req.id ? `[${req.id}] ` : '';

    console.log(`${id}${req.method} ${req.path} ${res.statusCode}`);
  });

  next();
};