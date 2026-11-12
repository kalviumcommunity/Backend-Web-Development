'use strict';

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 5, // Maximum 5 failed attempts per IP

  standardHeaders: true,
  legacyHeaders: false,

  skipSuccessfulRequests: true,

  handler: (req, res) => {
    const retryAfter = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);

    res.setHeader('Retry-After', retryAfter);

    res.status(429).json({
      message: 'Too many requests. Please try again later.'
    });
  }
});

/*
 * Multi-instance deployment:
 *
 * The default in-memory store keeps rate-limit counters inside the memory
 * of a single server instance. When multiple instances run behind a load
 * balancer, each instance maintains separate counters. This allows users
 * to bypass the intended limit by sending requests to different instances.
 *
 * To solve this, use rate-limit-redis with a shared Redis database.
 * Replace the default in-memory store with a Redis-backed store so all
 * instances share the same rate-limit counters.
 */

module.exports = authLimiter;