
const prisma = require('../db/prisma');

function handleDatabaseError(error) {
  if (error.code === 'P2002' || error.code === 'P2003') {
    const safeError = new Error('A database constraint was violated');
    safeError.statusCode = 409;
    throw safeError;
  }

  const safeError = new Error('Database operation failed');
  safeError.statusCode = 500;
  throw safeError;
}

async function findAll() {
  try {
    return await prisma.post.findMany({
      orderBy: { id: 'asc' },
    });
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function findById(id) {
  try {
    return await prisma.post.findUnique({
      where: { id: Number(id) },
    });
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function create(fields) {
  try {
    return await prisma.post.create({
      data: {
        title: fields.title,
        body: fields.body || '',
        authorId: Number(fields.authorId),
      },
    });
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function update(id, patch) {
  try {
    const result = await prisma.post.updateMany({
      where: { id: Number(id) },
      data: {
        ...(patch.title !== undefined && { title: patch.title }),
        ...(patch.body !== undefined && { body: patch.body }),
      },
    });

    if (result.count === 0) return null;

    return await prisma.post.findUnique({
      where: { id: Number(id) },
    });
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function remove(id) {
  try {
    const result = await prisma.post.deleteMany({
      where: { id: Number(id) },
    });

    return result.count > 0;
  } catch (error) {
    handleDatabaseError(error);
  }
}

module.exports = { findAll, findById, create, update, remove };
