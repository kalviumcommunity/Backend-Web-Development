'use strict';

const rateLimit = require('express-rate-limit');

// In a multi-instance deployment behind a load balancer, the default in-memory
// store is not enough because each Node instance keeps its own counter. A client
// can be spread across several app instances and each instance will count only
// its own requests, so the effective limit is multiplied by the number of
// instances. To share counters across processes, replace the default store with a
// Redis-backed one such as `rate-limit-redis`, e.g. by passing a Redis client to
// `express-rate-limit`'s store option so all instances enforce the same window.
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    const resetTime = req.rateLimit?.resetTime ?? Date.now() + 15 * 60 * 1000;
    const retryAfter = Math.max(1, Math.ceil((resetTime - Date.now()) / 1000));

    res.set('Retry-After', String(retryAfter));
    res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.'
      }
    });
  }
});
