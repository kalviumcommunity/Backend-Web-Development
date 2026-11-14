'use strict';

// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

// NOTE: The default store keeps counters in this Node.js process's memory.
// For a multi-instance deployment behind a load balancer, replace it with
// a Redis-backed store such as `rate-limit-redis`. A Redis store shares the
// rate-limit counters across all application instances, whereas the in-memory
// store gives each instance its own separate counter and therefore would let
// an attacker bypass the limit by sending requests to different instances.

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});