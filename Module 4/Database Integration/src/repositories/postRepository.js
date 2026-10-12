const prisma = require('../db/prisma');

function validId(id) {
  const numericId = Number(id);
  return Number.isSafeInteger(numericId) && numericId > 0 ? numericId : null;
}

function translateConstraintError(error) {
  if (error.code === 'P2002') {
    const conflict = new Error('A record with these values already exists');
    conflict.statusCode = 409;
    return conflict;
  }

  if (error.code === 'P2003' || error.code === 'P2014') {
    const invalidRelation = new Error('A referenced record does not exist');
    invalidRelation.statusCode = 422;
    return invalidRelation;
  }

  return error;
}

async function findAll() {
  return prisma.post.findMany({ orderBy: { id: 'asc' } });
}

async function findById(id) {
  const numericId = validId(id);
  if (numericId === null) return null;
  return prisma.post.findUnique({ where: { id: numericId } });
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
    throw translateConstraintError(error);
  }
}

async function update(id, patch) {
  const numericId = validId(id);
  if (numericId === null) return null;

  const data = {};
  if (patch.title !== undefined) data.title = patch.title;
  if (patch.body !== undefined) data.body = patch.body;

  try {
    return await prisma.post.update({ where: { id: numericId }, data });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw translateConstraintError(error);
  }
}

async function remove(id) {
  const numericId = validId(id);
  if (numericId === null) return false;

  try {
    await prisma.post.delete({ where: { id: numericId } });
    return true;
  } catch (error) {
    if (error.code === 'P2025') return false;
    throw translateConstraintError(error);
  }
}

module.exports = { findAll, findById, create, update, remove };
