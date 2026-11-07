'use strict';

const rateLimit = require('express-rate-limit');

// The default in-memory store keeps counters separately in each Node.js process.
// Behind a load balancer, each instance has its own counter, so users can exceed
// the intended limit by reaching multiple instances. A Redis-backed store using
// `rate-limit-redis` shares one counter across all instances.
module.exports = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
	skipSuccessfulRequests: true,
	handler: (req, res) => {
		const resetTime = req.rateLimit && req.rateLimit.resetTime;
		const retryAfterSeconds = resetTime instanceof Date
			? Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000))
			: 15 * 60;

		res.setHeader('Retry-After', String(retryAfterSeconds));
		res.status(429).json({
			error: {
				code: 'RATE_LIMIT_EXCEEDED',
				message: 'Too many requests, please try again later.',
			},
		});
	},
});
