const prisma = require('../db/prisma');

function databaseError(error) {
  if (error && error.code === 'P2002') {
    const conflict = new Error('The requested relationship already exists');
    conflict.statusCode = 409;
    return conflict;
  }

  if (error && error.code === 'P2003') {
    const invalidRelation = new Error('The related record does not exist');
    invalidRelation.statusCode = 422;
    return invalidRelation;
  }

  return error;
}

async function findAll() {
  return prisma.post.findMany({ orderBy: { id: 'asc' } });
}

async function findById(id) {
  return prisma.post.findUnique({ where: { id: Number(id) } });
}

async function create(fields) {
  try {
    return await prisma.post.create({
      data: {
        title: fields.title,
        body: fields.body || '',
        authorId: fields.authorId,
      },
    });
  } catch (error) {
    throw databaseError(error);
  }
}

async function update(id, patch) {
  const post = await findById(id);
  if (!post) return null;

  try {
    return await prisma.post.update({
      where: { id: Number(id) },
      data: patch,
    });
  } catch (error) {
    throw databaseError(error);
  }
}

async function remove(id) {
  const post = await findById(id);
  if (!post) return false;

  await prisma.post.delete({ where: { id: Number(id) } });
  return true;
}

module.exports = { findAll, findById, create, update, remove };
