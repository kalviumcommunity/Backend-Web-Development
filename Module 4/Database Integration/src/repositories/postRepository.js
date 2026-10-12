const prisma = require('../db/prisma');

const postFields = { id: true, title: true, body: true, authorId: true };

function normalizeId(id) {
  const value = Number(id);
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

function databaseError(error) {
  let message = 'Database operation failed';
  let statusCode = 503;

  if (error.code === 'P2002') {
    message = 'A record with these values already exists';
    statusCode = 409;
  } else if (error.code === 'P2003') {
    message = 'A referenced record does not exist';
    statusCode = 422;
  } else if (error.name === 'PrismaClientValidationError') {
    message = 'The supplied data is invalid';
    statusCode = 422;
  }

  return Object.assign(new Error(message), { statusCode });
}

async function withDatabaseErrors(operation) {
  try {
    return await operation();
  } catch (error) {
    throw databaseError(error);
  }
}

async function findAll() {
  return withDatabaseErrors(() => prisma.post.findMany({
    orderBy: { id: 'asc' },
    select: postFields,
  }));
}

async function findById(id) {
  const postId = normalizeId(id);
  if (postId === null) return null;

  return withDatabaseErrors(() => prisma.post.findUnique({
    where: { id: postId },
    select: postFields,
  }));
}

async function create(fields) {
  return withDatabaseErrors(() => prisma.post.create({
    data: {
      title: fields.title,
      body: fields.body || '',
      authorId: fields.authorId,
    },
    select: postFields,
  }));
}

async function update(id, patch) {
  const postId = normalizeId(id);
  if (postId === null) return null;

  try {
    return await prisma.post.update({
      where: { id: postId },
      data: { title: patch.title, body: patch.body },
      select: postFields,
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw databaseError(error);
  }
}

async function remove(id) {
  const postId = normalizeId(id);
  if (postId === null) return false;

  try {
    await prisma.post.delete({ where: { id: postId } });
    return true;
  } catch (error) {
    if (error.code === 'P2025') return false;
    throw databaseError(error);
  }
}

module.exports = { findAll, findById, create, update, remove };
