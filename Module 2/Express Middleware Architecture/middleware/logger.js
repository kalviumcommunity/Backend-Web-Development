module.exports = function logger(req, res, next) {
  res.on('finish', () => {
    const requestId = req.id ? `[${req.id}] ` : '';
    console.log(`${requestId}${req.method} ${req.path} ${res.statusCode}`);
  });

  next();
};
