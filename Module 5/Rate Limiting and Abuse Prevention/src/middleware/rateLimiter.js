'use strict';
// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

// YOUR TASK: replace this pass-through with a real rate limiter.

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes

    max: 5, // Maximum 5 attempts per IP per window

    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: true,

    message: {
        message: 'Too many login attempts. Please try again later.'
    },

    // In a multi-instance deployment, use rate-limit-redis with a shared
    // Redis store instead of the default in-memory store. This ensures all
    // application instances share the same rate-limit counters. The in-memory
    // store is insufficient because each instance maintains separate counters,
    // allowing users to bypass the limit by sending requests to different
    // instances behind a load balancer.
});