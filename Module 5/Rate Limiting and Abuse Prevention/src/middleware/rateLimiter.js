
'use strict';
// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

// Redis-backed store (rate-limit-redis) can replace the default in-memory
// store in a multi-instance deployment. Each server instance otherwise
// maintains its own separate counter, so requests routed by a load balancer
// could bypass the limit by reaching different instances. Redis provides
// a shared store so all instances use the same rate-limit counters.

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
