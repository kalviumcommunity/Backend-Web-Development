
'use strict';

const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,

    handler: (req, res) => {
        const retryAfter = Math.ceil(
            (req.rateLimit.resetTime - Date.now()) / 1000
        );

        res.set(
            'Retry-After',
            String(Math.max(retryAfter, 1))
        );

        res.status(429).json({
            error: 'Too many requests, please try again later.'
        });
    }
});

// In a multi-instance deployment, rate-limit-redis can replace
// the default in-memory store with a shared Redis store.
// In-memory counters are separate for each server instance.
// Behind a load balancer, requests can reach different instances,
// allowing users to bypass the intended rate limit.
// Redis shares one counter across all instances.
