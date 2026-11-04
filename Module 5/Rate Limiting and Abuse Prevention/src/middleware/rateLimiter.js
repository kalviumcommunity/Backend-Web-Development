'use strict';
const rateLimit = require('express-rate-limit');

// In a multi-instance deployment behind a load balancer, the default in-memory
// store is not enough because each Node process keeps its own counters. A single
// client can therefore hit the limit across multiple app instances and each
// instance will think it has only used a fraction of the total quota. A Redis-
// backed store such as `rate-limit-redis` replaces the default memory store so
// every instance shares the same rate-limit state and enforces a true global cap.
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    const seconds = Math.max(1, Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000));
    res.set('Retry-After', String(seconds));
    res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
      },
    });
  },
});
