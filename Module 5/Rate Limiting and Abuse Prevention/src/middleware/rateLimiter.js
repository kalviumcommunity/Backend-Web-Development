'use strict';

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  // Redis scaling:
  // In a multi-instance deployment, rate-limit-redis can be used
  // with RedisStore to share request counters across all instances.
  // The default in-memory store maintains separate counters in
  // each Node.js instance. Behind a load balancer, requests may
  // reach different instances, allowing users more attempts.
  // Redis provides one shared counter across all instances.
});

module.exports = authLimiter;
