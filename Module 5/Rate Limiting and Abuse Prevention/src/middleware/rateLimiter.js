const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});

// In production with multiple server instances,
// use rate-limit-redis to share counters through Redis.
// The default in-memory store maintains separate counters
// for each instance, so the rate limit is not shared
// across servers behind a load balancer.

module.exports = authLimiter;
