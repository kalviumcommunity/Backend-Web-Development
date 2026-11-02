const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 5,

    skipSuccessfulRequests: true,

    standardHeaders: true,

    legacyHeaders: false,

    handler: (req, res) => {
        res.setHeader('Retry-After', '900');

        res.status(429).json({
            error: 'Too many requests, please try again later.'
        });
    }
});

/*
Redis-backed store:
In a multi-instance deployment, we can use rate-limit-redis
to share the request counter between all server instances.

The default in-memory store keeps separate counters in each
instance. Therefore, users may get extra attempts when their
requests reach different instances behind a load balancer.

Redis provides one shared counter across all instances.
*/

module.exports = authLimiter;
