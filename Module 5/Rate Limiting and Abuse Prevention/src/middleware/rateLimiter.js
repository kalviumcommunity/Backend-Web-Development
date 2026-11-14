'use strict';
const rateLimit = require('express-rate-limit');

// For multiple instances, use rate-limit-redis's RedisStore here (for example,
// `store: new RedisStore({ sendCommand: (...args) => redis.call(...args) })`).
// The default MemoryStore is process-local, so a load balancer can spread a
// client's requests across instances and give that client a separate limit on
// each one instead of enforcing a single shared limit.
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,        // 15 minutes
  max: 5,                          // 5 attempts per window per IP
  standardHeaders: true,           // send RateLimit-* headers
  legacyHeaders: false,            // drop old X-RateLimit-* headers
  skipSuccessfulRequests: true,    // only FAILED attempts count
  handler: (req, res) => {
    // Seconds until the window resets
    const retryAfter = Math.ceil(
      (req.rateLimit.resetTime.getTime() - Date.now()) / 1000
    );
    res.set('Retry-After', String(Math.max(retryAfter, 1)));
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  },
});