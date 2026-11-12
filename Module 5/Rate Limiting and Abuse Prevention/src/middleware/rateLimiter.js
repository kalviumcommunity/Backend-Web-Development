
'use strict';

// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    // 15 minutes
    windowMs: 15 * 60 * 1000,

    // Maximum 5 attempts per IP
    max: 5,

    // Only failed requests count
    skipSuccessfulRequests: true,

    // Enable standard headers
    standardHeaders: true,

    // Disable legacy headers
    legacyHeaders: false,

});

// Redis explanation:
//
// The default MemoryStore stores counters in the memory
// of each Node.js server instance.
//
// When multiple instances run behind a load balancer,
// each instance has a separate counter. This can allow
// users to exceed the intended limit.
//
// In production, rate-limit-redis can replace MemoryStore
// using a shared Redis connection. All instances then use
// the same counter, enforcing one common rate limit.
//
// Example:
// store: new RedisStore({
//     sendCommand: (...args) => redis.call(...args)
// }),

module.exports = authLimiter;
