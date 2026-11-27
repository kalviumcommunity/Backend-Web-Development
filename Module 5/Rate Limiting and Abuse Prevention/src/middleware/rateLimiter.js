'use strict';

const rateLimit = require('express-rate-limit');

// Strict rate limiter for authentication routes.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// In a multi-instance deployment, use a Redis-backed store such as
// rate-limit-redis instead of the default in-memory store.
// The in-memory store keeps counters separately in each Node.js process.
// Behind a load balancer, requests may reach different instances, allowing
// users to exceed the intended limit. Redis provides a shared counter.

module.exports = authLimiter;