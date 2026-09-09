/**
 * Articles controller
 *
 * Each handler is an async function. asyncHandler wraps these in the route file,
 * so we don't need try/catch here — rejections are forwarded to the error handler.
 */

const service = require('./../services/articlesService');

exports.list = async (req, res, next) => {
  const articles = await service.getAll();
  res.json({ data: articles });
};

exports.create = async (req, res, next) => {
  const article = await service.create(req.body);
  res.status(201).json({ data: article });
};

exports.update = async (req, res, next) => {
  const article = await service.update(Number(req.params.id), req.body);
  res.json({ data: article });
};
