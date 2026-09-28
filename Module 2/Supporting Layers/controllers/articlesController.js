const service = require('../services/articlesService');

exports.list = async (req, res, next) => {
  try {
    const articles = await service.getAll();
    res.json({ data: articles });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const article = await service.getById(Number(req.params.id));
    res.json({ data: article });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const article = await service.create(req.body);
    res.status(201).json({ data: article });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const article = await service.update(Number(req.params.id), req.body);
    res.json({ data: article });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await service.remove(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};