'use strict';
// middleware/rateLimiter.js
//
// Rate limiter implementation for sensitive authentication routes using express-rate-limit.
//
// REDIS / DISTRIBUTED ARCHITECTURE EXPLANATION:
// - The default MemoryStore stores hit counters in memory inside a single Node.js process.
// - When multiple server instances run behind a load balancer, each instance maintains a separate,
//   independent in-memory counter.
// - As a result, users/attackers could exceed the intended limit across different instances
//   (e.g., hitting instance A 5 times, instance B 5 times, bypassing the overall 5-request cap).
// - A Redis-backed store using `rate-limit-redis` shares a single centralized counter across all instances.
// - RedisStore can replace the default in-memory store through the `store` configuration option:
//     const { RedisStore } = require('rate-limit-redis');
//     store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) })

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Limit each IP to 5 requests per windowMs
  statusCode: 429, // Return 429 Too Many Requests when limit is exceeded
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many login attempts, please try again later.'
    }
  },
  skipSuccessfulRequests: true, // Only failed requests count towards the limit
  standardHeaders: true, // Return rate limit info in `RateLimit-*` and `Retry-After` headers
  legacyHeaders: false // Disable `X-RateLimit-*` headers
});

module.exports = authLimiter;
