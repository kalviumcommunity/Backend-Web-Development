'use strict';
// middleware/rateLimiter.js
//
// Strict limiter for the auth routes (login / register / refresh).
// First 5 failed attempts per 15 minutes per IP pass through; the 6th
// attempt gets a 429 with a Retry-After header.

const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute sliding window
  max: 5,                   // 5 attempts per window per IP
  standardHeaders: true,    // send RateLimit-* headers
  legacyHeaders: false,     // don't send the old X-RateLimit-* headers
  // Only FAILED attempts count toward the limit — successful logins
  // shouldn't punish legitimate users (skipSuccessfulRequests).
  skipSuccessfulRequests: true,

  handler: (req, res) => {
    const retryAfter = Math.max(
      1,
      Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
    );
    res.set('Retry-After', retryAfter);
    res.status(429).json({
      message: 'Too many attempts, please try again later.',
    });
  },
});

// NOTE — Redis-backed store (rate-limit-redis):
// By default express-rate-limit keeps counters in the process's memory.
// That works for a single instance, but behind a load balancer with N
// instances each process maintains its OWN independent counter, so a
// client whose requests land on different instances effectively gets
// N x the limit (5 attempts become 5 x N), defeating the protection.
// In a multi-instance deployment, pass a shared store so every instance
// increments the same counters:
//
//   const { RedisStore } = require('rate-limit-redis');
//   const Redis = require('ioredis');
//   const client = new Redis(process.env.REDIS_URL);
//
//   module.exports = rateLimit({
//     ...sameOptions,
//     store: new RedisStore({ sendCommand: (...args) => client.call(...args) }),
//   });
//
// Redis is fast, shared across all instances, survives restarts, and can
// enforce the per-IP limit globally no matter which instance serves the
// request.
