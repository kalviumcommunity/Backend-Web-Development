const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.setHeader('Retry-After', '900');

    return res.status(429).json({
      error: 'Too many requests, please try again later.'
    });
  }
});

module.exports = authLimiter;