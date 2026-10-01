module.exports = {
  port: Number.parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'development-secret',
  maxArticles: Number.parseInt(process.env.MAX_ARTICLES, 10) || 50,
};