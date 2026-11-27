
const rateLimit = require('express-rate-limit');

const windowMs = 15 * 60 * 1000; // 15 minutes

const authLimiter = rateLimit({
  windowMs: windowMs,
  max: 5, // Allow 5 attempts per IP in each window

  skipSuccessfulRequests: true,

  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    // Calculate how many seconds remain before the limit resets.
    const resetTime = req.rateLimit.resetTime;

    const retryAfter = resetTime
      ? Math.max(
          1,
          Math.ceil((resetTime.getTime() - Date.now()) / 1000)
        )
      : Math.ceil(windowMs / 1000);

    res.set('Retry-After', String(retryAfter));

    res.status(429).json({
      error: 'Too many requests, please try again later.',
    });
  },
});

/*
  For a multi-instance deployment, a Redis-backed store such as
  rate-limit-redis can replace the default in-memory store.

  The in-memory store keeps counters separately inside each Node.js
  instance. Behind a load balancer, requests may reach different
  instances, allowing a client to exceed the intended limit.

  Redis provides a shared counter so all instances enforce the
  same rate limit.
*/

module.exports = authLimiter;
