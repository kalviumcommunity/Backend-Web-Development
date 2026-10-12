const prisma = require('../lib/prisma');

function handleDatabaseError(error) {
  if (error && error.code === 'P2002') {
    const conflict = new Error('A record with these values already exists');
    conflict.statusCode = 409;
    throw conflict;
  }

  if (error && error.code === 'P2003') {
    const conflict = new Error('The related record does not exist');
    conflict.statusCode = 409;
    throw conflict;
  }

  throw error;
}

async function findAll() {
  return prisma.post.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}

async function findById(id) {
  return prisma.post.findUnique({
    where: {
      id: Number(id),
    },
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
    handleDatabaseError(error);
  }
}

async function update(id, patch) {
  const postId = Number(id);

  try {
    return await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...(patch && patch.title !== undefined ? { title: patch.title } : {}),
        ...(patch && patch.body !== undefined ? { body: patch.body } : {}),
      },
    });
  } catch (error) {
    if (error && error.code === 'P2025') {
      return null;
    }
    handleDatabaseError(error);
  }
}

async function remove(id) {
  try {
    await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });
    return true;
  } catch (error) {
    if (error && error.code === 'P2025') {
      return false;
    }
    handleDatabaseError(error);
  }
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
