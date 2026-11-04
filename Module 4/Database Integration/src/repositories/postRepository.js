const prisma = require('../db/prisma');

function databaseError(error) {
  if (error.code === 'P2002') {
    const conflict = new Error('The requested relationship already exists');
    conflict.statusCode = 409;
    return conflict;
  }

  if (error.code === 'P2003') {
    const invalidRelation = new Error('The requested relationship is invalid');
    invalidRelation.statusCode = 422;
    return invalidRelation;
  }

  if (error.name === 'PrismaClientInitializationError' || ['P1000', 'P1001', 'P1017'].includes(error.code)) {
    const unavailable = new Error('Database unavailable');
    unavailable.statusCode = 503;
    return unavailable;
  }

  if (error.name === 'PrismaClientValidationError') {
    const invalidData = new Error('Invalid post data');
    invalidData.statusCode = 422;
    return invalidData;
  }

  return error;
}

async function findAll() {
  try {
    return await prisma.post.findMany({ orderBy: { id: 'asc' } });
  } catch (error) {
    throw databaseError(error);
  }
}

async function findById(id) {
  try {
    return await prisma.post.findUnique({ where: { id: Number(id) } });
  } catch (error) {
    throw databaseError(error);
  }
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
  const existing = await findById(id);
  if (!existing) return null;

  try {
    return await prisma.post.update({
      where: { id: Number(id) },
      data: {
        ...(patch.title !== undefined ? { title: patch.title } : {}),
        ...(patch.body !== undefined ? { body: patch.body } : {}),
      },
    });
  } catch (error) {
    throw databaseError(error);
  }
}

async function remove(id) {
  const existing = await findById(id);
  if (!existing) return false;

  try {
    await prisma.post.delete({ where: { id: Number(id) } });
    return true;
  } catch (error) {
    throw databaseError(error);
  }
}

module.exports = { findAll, findById, create, update, remove };
