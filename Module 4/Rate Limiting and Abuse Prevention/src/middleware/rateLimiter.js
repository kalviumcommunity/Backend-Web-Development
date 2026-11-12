'use strict';
const rateLimit = require('express-rate-limit');
const authRateLimiter = rateLimit({
    // Time window: 15 minutes
    windowMs: 15 * 60 * 1000,
    // Maximum 5 failed attempts per IP
    max: 5,
    // Send modern rate-limit headers
    standardHeaders: true,
    // Disable legacy X-RateLimit headers
    legacyHeaders: false,
    // Only count failed requests
    skipSuccessfulRequests: true,
    // Response when the rate limit is exceeded
    message: {
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    // Redis-backed store for multi-instance deployments:
    //
    // const RedisStore = require('rate-limit-redis').default;
    //
    // store: new RedisStore({
    //     sendCommand: (...args) => redisClient.call(...args),
    // }),
    //
    // The default in-memory store keeps rate-limit counters
    // separately in each Node.js application instance.
    // When multiple instances run behind a load balancer,
    // requests may reach different instances, allowing users
    // to bypass the intended limit.
    //
    // A shared Redis store maintains common counters across
    // all instances, ensuring consistent rate limiting.
});
module.exports = authRateLimiter;