'use strict';

const rateLimit = require('express-rate-limit');

// In a multi-instance deployment behind a load balancer, the default in-memory
// store is not enough because each running server keeps its own counter. That means
// the same client can make 5 attempts on one instance and another 5 on a different
// instance, effectively multiplying the real limit across the cluster. In production,
// a Redis-backed store (for example, `rate-limit-redis`) replaces the in-memory store
// so every app instance shares one counter and enforces the same limit consistently.
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Too many requests, please try again later.'
    });
  }
});
