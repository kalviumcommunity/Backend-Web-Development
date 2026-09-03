const PORT = parseInt(process.env.PORT, 10) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || '';
const MAX_ARTICLES = parseInt(process.env.MAX_ARTICLES, 10) || 50;

module.exports = {
  port: PORT,
  nodeEnv: NODE_ENV,
  jwtSecret: JWT_SECRET,
  maxArticles: MAX_ARTICLES,
};
