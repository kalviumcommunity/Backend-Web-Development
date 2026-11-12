'use strict';

// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  // Time window: 15 minutes
  windowMs: 15 * 60 * 1000,

  // Maximum 5 requests per IP
  max: 5,

  // Return rate limit information in standard headers
  standardHeaders: true,

  // Disable legacy X-RateLimit headers
  legacyHeaders: false,

  // Only count failed login attempts
  skipSuccessfulRequests: true,

  // Custom response after exceeding the limit
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many login attempts. Please try again later.',
    },
  },

  // Redis Store for production:
  // In a multi-instance deployment, use rate-limit-redis with a shared
  // Redis database so all server instances share the same rate-limit counts.
  // The default in-memory store keeps counts separately in each instance.
  // Therefore, requests routed through different instances could bypass
  // the intended limit. Redis provides centralized, consistent tracking.
});

module.exports = limiter;