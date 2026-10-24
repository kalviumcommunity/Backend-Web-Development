'use strict';

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// For multiple app instances, rate-limit-redis provides a shared Redis store.
// In-memory counters are separate per instance, so a load balancer can split
// requests across counters. A shared store keeps the limit consistent.

module.exports = authLimiter;
