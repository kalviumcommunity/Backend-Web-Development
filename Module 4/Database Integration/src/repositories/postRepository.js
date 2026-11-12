const prisma = require('../db/prisma');

function normalizeId(id) {
  const parsedId = Number(id);
  return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

function createConflictError() {
  const error = new Error('The request conflicts with an existing or related record');
  error.statusCode = 409;
  return error;
}

function throwSafeConstraintError(error) {
  if (['P2002', 'P2003', 'P2004', 'P2011', 'P2014'].includes(error.code)) {
    throw createConflictError();
  }
  throw error;
}

async function findAll() {
  return prisma.post.findMany({ orderBy: { id: 'asc' } });
}

async function findById(id) {
  const postId = normalizeId(id);
  if (postId === null) return null;
  return prisma.post.findUnique({ where: { id: postId } });
}

async function create(fields) {
  if (!Number.isSafeInteger(fields.authorId) || fields.authorId <= 0) {
    throw createConflictError();
  }

  try {
    return await prisma.post.create({
      data: {
        title: fields.title,
        body: fields.body || '',
        authorId: fields.authorId,
      },
    });
  } catch (error) {
    throwSafeConstraintError(error);
  }
}

async function update(id, patch) {
  const postId = normalizeId(id);
  if (postId === null) return null;

  try {
    return await prisma.post.update({ where: { id: postId }, data: patch });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throwSafeConstraintError(error);
  }
}

async function remove(id) {
  const postId = normalizeId(id);
  if (postId === null) return false;
  const result = await prisma.post.deleteMany({ where: { id: postId } });
  return result.count > 0;
}

module.exports = { findAll, findById, create, update, remove };
