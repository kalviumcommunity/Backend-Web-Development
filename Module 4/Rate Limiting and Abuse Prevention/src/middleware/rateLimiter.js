'use strict';

// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,

    message: {
        error: 'Too many login attempts. Please try again later.'
    }
});

// Redis-backed store:
// In a multi-instance deployment, rate-limit-redis can use a shared Redis
// database to maintain counters across all server instances.
// The default in-memory store keeps separate counters in each instance,
// allowing users to bypass limits when requests are distributed by a load balancer.