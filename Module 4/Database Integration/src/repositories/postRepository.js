const prisma = require('../db/prisma');

function databaseError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function findAll() {
  return prisma.post.findMany();
}

async function findById(id) {
  return prisma.post.findUnique({
    where: { id: Number(id) },
  });
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
    if (error.code === 'P2003') {
      throw databaseError('Invalid author', 422);
    }

    if (error.code === 'P2002') {
      throw databaseError('A record with these values already exists', 409);
    }

    throw error;
  }
}

async function update(id, patch) {
  try {
    return await prisma.post.update({
      where: { id: Number(id) },
      data: {
        ...(patch.title !== undefined && { title: patch.title }),
        ...(patch.body !== undefined && { body: patch.body }),
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return null;
    }

    if (error.code === 'P2002') {
      throw databaseError('A record with these values already exists', 409);
    }

    throw error;
  }
}

async function remove(id) {
  try {
    await prisma.post.delete({
      where: { id: Number(id) },
    });

    return true;
  } catch (error) {
    if (error.code === 'P2025') {
      return false;
    }

    throw error;
  }
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};