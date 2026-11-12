'use strict';

// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum 5 attempts per IP
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,

    // Redis integration:
    // In a multi-instance deployment, rate-limit-redis can be used
    // with a shared Redis database to maintain common rate-limit
    // counters across all server instances. The default in-memory
    // store keeps separate counters per instance, so requests routed
    // to different instances by a load balancer may bypass the limit.
});