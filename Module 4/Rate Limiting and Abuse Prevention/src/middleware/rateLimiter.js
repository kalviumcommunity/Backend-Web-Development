'use strict';

const rateLimit = require('express-rate-limit');

// In a multi-instance deployment, use a shared store such as `rate-limit-redis`
// instead of the default in-memory store. That way all app instances share the
// same request counters behind a load balancer. With only the in-memory store,
// each instance keeps its own counter, so a client spread across N instances can
// get N times the allowed attempts before being throttled.
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    const resetTime = req.rateLimit && req.rateLimit.resetTime ? req.rateLimit.resetTime : Date.now() + 15 * 60 * 1000;
    const retryAfter = Math.max(1, Math.ceil((resetTime - Date.now()) / 1000));

    res.setHeader('Retry-After', String(retryAfter));
    res.status(429).json({
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests. Please try again later.',
      },
    });
  },
});
