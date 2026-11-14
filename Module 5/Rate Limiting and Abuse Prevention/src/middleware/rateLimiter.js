'use strict';

const rateLimit = require('express-rate-limit');

// In a multi-instance deployment, configure a shared Redis store from
// `rate-limit-redis` here instead of the default in-memory store. Memory is
// local to each process, so instances behind a load balancer would otherwise
// each track a separate limit and allow more attempts than intended.
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});
