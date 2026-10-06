'use strict';
// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true
});

// In a multi-instance deployment, the default in-memory store is not enough
// because each server instance keeps its own request counter. Behind a load
// balancer, a client could therefore get a separate limit on each instance.
// A Redis-backed store such as rate-limit-redis would replace the default
// store so all instances share the same counter and enforce one limit.

module.exports = authLimiter;
