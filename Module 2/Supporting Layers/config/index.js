const port = Number(process.env.PORT) || 3000;

const nodeEnv = process.env.NODE_ENV || 'development';

const jwtSecret = process.env.JWT_SECRET || 'dev-secret';

const maxArticles = Number(process.env.MAX_ARTICLES) || 100;

module.exports = {
  port,
  nodeEnv,
  jwtSecret,
  maxArticles,
};