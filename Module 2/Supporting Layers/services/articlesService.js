/**
 * Articles service.
 *
 * AppError is imported from utils/AppError.js (single source of truth).
 * maxArticles cap is imported from config.
 */

'use strict';

const repo     = require('../repository/articlesRepo');
const AppError = require('../utils/AppError');
const config   = require('../config');

exports.getAll = async () => repo.findAll();

exports.create = async ({ title, body }) => {
  const count = await repo.count();
  if (count >= config.maxArticles) {
    throw new AppError('Article limit reached', 403);
  }
  return repo.insert({ title, body });
};

exports.update = async (id, data) => {
  const article = await repo.findById(id);
  if (!article) throw new AppError('Article not found', 404);
  return repo.update(id, data);
};
