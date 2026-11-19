const prisma = require('../db/prisma');

function handleDatabaseError(error) {
  if (error.code === 'P2002') {
    const mapped = new Error('A record with these values already exists');
    mapped.statusCode = 409;
    return mapped;
  }

  if (error.code === 'P2003') {
    const mapped = new Error('A referenced record does not exist');
    mapped.statusCode = 422;
    return mapped;
  }

  if (['P1001', 'P1002', 'P2024'].includes(error.code)) {
    const mapped = new Error('Database service is currently unavailable');
    mapped.statusCode = 503;
    return mapped;
  }

  const mapped = new Error('Database operation failed');
  mapped.statusCode = 500;
  return mapped;
}

async function findAll() {
  try {
    return await prisma.post.findMany({
      orderBy: { id: 'asc' },
    });
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

async function findById(id) {
  try {
    return await prisma.post.findUnique({
      where: { id: Number(id) },
    });
  } catch (error) {
    throw handleDatabaseError(error);
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
    throw handleDatabaseError(error);
  }
}

async function update(id, patch) {
  try {
    const existing = await findById(id);

    if (!existing) {
      return null;
    }

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

    throw handleDatabaseError(error);
  }
}

async function remove(id) {
  try {
    const existing = await findById(id);

    if (!existing) {
      return false;
    }

    await prisma.post.delete({
      where: { id: Number(id) },
    });

    return true;
  } catch (error) {
    if (error.code === 'P2025') {
      return false;
    }

    throw handleDatabaseError(error);
  }
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};