module.exports = {
  port: process.env.PORT || 5500,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  maxArticles: parseInt(process.env.MAX_ARTICLES) || 50,
};