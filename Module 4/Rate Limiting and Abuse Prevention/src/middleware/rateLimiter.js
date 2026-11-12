
'use strict';

// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 5, // Maximum 5 attempts per IP

  standardHeaders: true,
  legacyHeaders: false,

  skipSuccessfulRequests: true,

  message: {
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },

  // Redis integration:
  // In a multi-instance deployment, use rate-limit-redis with a shared
  // Redis store so all server instances share the same rate-limit counters.
  // The default in-memory store keeps counters separately in each instance,
  // allowing users to bypass the limit by reaching different instances
  // behind a load balancer.
});

module.exports = authLimiter;
