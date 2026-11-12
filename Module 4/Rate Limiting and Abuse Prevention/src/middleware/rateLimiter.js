
'use strict';

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  handler: (req, res, next, options) => {
    const retryAfter = Math.ceil(options.windowMs / 1000);

    res.set('Retry-After', retryAfter.toString());

    res.status(429).json({
      message: 'Too many login attempts. Please try again later.'
    });
  }
});

// Redis-backed store:
// In multi-instance deployments, rate-limit-redis can use a shared Redis
// database to maintain counters across all server instances.
// The default in-memory store maintains separate counters per instance,
// so requests distributed by a load balancer can bypass the rate limit.

module.exports = limiter;
