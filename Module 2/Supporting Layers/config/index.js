const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const parsedPort = Number(process.env.PORT);
const parsedMaxArticles = Number(process.env.MAX_ARTICLES);

module.exports = {
  port: Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'development-secret-change-me',
  maxArticles:
    Number.isInteger(parsedMaxArticles) && parsedMaxArticles > 0
      ? parsedMaxArticles
      : 50
};
