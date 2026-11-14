'use strict';

// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum 5 attempts per IP
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,

    // In a multi-instance deployment, use rate-limit-redis with a shared
    // Redis store so all instances maintain the same rate-limit counters.
    // The default in-memory store keeps counters separately in each instance,
    // so requests distributed by a load balancer could bypass the limit.
});