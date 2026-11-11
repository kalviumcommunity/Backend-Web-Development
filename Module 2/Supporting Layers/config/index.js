require('dotenv').config();

const parsedMaxArticles = Number.parseInt(process.env.MAX_ARTICLES, 10);

module.exports = Object.freeze({
  port: Number.parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'development-only-change-me',
  maxArticles: Number.isInteger(parsedMaxArticles) && parsedMaxArticles > 0
    ? parsedMaxArticles
    : 50
});
