/**
 * config/index.js — the ONLY file in the project that reads process.env.
 *
 * Every other module must import from here instead of touching process.env
 * directly. This gives us a single, auditable place for all runtime config.
 */

'use strict';

module.exports = {
  port:        process.env.PORT        || 3000,
  nodeEnv:     process.env.NODE_ENV    || 'development',
  jwtSecret:   process.env.JWT_SECRET,
  maxArticles: parseInt(process.env.MAX_ARTICLES) || 50,
};
