'use strict';

const rateLimitModule = require('express-rate-limit');
const rateLimit = rateLimitModule.rateLimit || rateLimitModule;

// Shared rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 failed attempts per IP

  standardHeaders: true,
  legacyHeaders: false,

  // Successful requests should not count towards the limit
  skipSuccessfulRequests: true,

  // Return 429 with Retry-After header when the limit is exceeded
  handler: (req, res) => {
    const resetTime = req.rateLimit && req.rateLimit.resetTime;

    const retryAfter = resetTime
      ? Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000))
      : 900;

    res.setHeader('Retry-After', String(retryAfter));

    return res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many attempts. Please try again later.',
      },
    });
  },
});

/*
 * MULTI-INSTANCE DEPLOYMENT:
 *
 * The default in-memory store keeps rate-limit counters inside the
 * memory of a single server instance.
 *
 * If multiple server instances run behind a load balancer, each
 * instance maintains separate counters. Requests distributed across
 * instances can therefore bypass the intended rate limit.
 *
 * In production, rate-limit-redis can replace the default store.
 * It uses a shared Redis database so all server instances access
 * the same counters and enforce a consistent rate limit.
 */

module.exports = authLimiter;