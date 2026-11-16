'use strict';
// middleware/rateLimiter.js
//
const rateLimit = require('express-rate-limit');

// In a multi-instance deployment, configure a `rate-limit-redis` store here
// instead of the default in-memory store so every instance shares one counter;
// the in-memory store is not sufficient behind a load balancer because requests
// can be distributed across separate, unsynchronized counters.
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
