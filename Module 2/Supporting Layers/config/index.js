/**
 * Configuration module
 *
 * This is the ONLY file in the app that reads process.env.
 * All other files must import from this module.
 *
 * Environment variables:
 *   - PORT: server port (defaults to 3000)
 *   - NODE_ENV: runtime environment (defaults to 'development')
 *   - JWT_SECRET: secret key for JWT signing (required for production)
 *   - MAX_ARTICLES: maximum number of articles (defaults to 50, parsed to number)
 */

module.exports = {
  port: parseInt(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  maxArticles: parseInt(process.env.MAX_ARTICLES) || 50
};
