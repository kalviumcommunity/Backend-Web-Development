'use strict';

// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum 5 attempts per IP
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,

    // After 5 failed attempts, express-rate-limit automatically
    // responds with HTTP 429 (Too Many Requests).
});

// Redis-backed store:
// In a multi-instance deployment, use rate-limit-redis with a shared
// Redis database so all server instances share the same rate-limit counts.
// The default in-memory store keeps counts separately in each instance,
// allowing users to bypass the limit by reaching another instance
// through the load balancer.

module.exports = limiter;