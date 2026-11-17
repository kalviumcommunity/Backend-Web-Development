'use strict';

// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  message: {
    error: 'Too many login attempts. Please try again later.'
  }

  // Multi-instance deployment:
  // The default in-memory store tracks requests separately in each
  // application instance. Behind a load balancer, requests distributed
  // across instances can bypass the intended global rate limit.
  // Use rate-limit-redis with a shared Redis instance so all application
  // instances read and update the same rate-limit counters.
});