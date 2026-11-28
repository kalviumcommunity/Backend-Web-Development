
'use strict';

// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum 5 attempts per IP
    skipSuccessfulRequests: true, // Only failed requests count
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: 'Too many requests, please try again later.'
    }
});

// Redis scaling note:
// In a multi-instance deployment, rate-limit-redis can replace
// the default in-memory store with a shared Redis store.
// MemoryStore keeps separate counters in each Node.js instance.
// Behind a load balancer, requests may reach different instances,
// allowing users to exceed the intended limit.
// Redis shares one counter across all instances.

module.exports = authLimiter;
