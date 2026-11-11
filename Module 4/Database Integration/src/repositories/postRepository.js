
const prisma = require('../config/prisma');

// Handle database errors inside the repository layer
async function executeQuery(query) {
  try {
    return await query();
  } catch (error) {
    if (error.code === 'P2003') {
      const safeError = new Error(
        'Invalid reference: related record does not exist'
      );
      safeError.statusCode = 400;
      throw safeError;
    }

    if (error.code === 'P2002') {
      const safeError = new Error(
        'A record with this value already exists'
      );
      safeError.statusCode = 409;
      throw safeError;
    }

    throw error;
  }
}

async function findAll() {
  return executeQuery(() =>
    prisma.post.findMany({
      orderBy: { id: 'asc' }
    })
  );
}

async function findById(id) {
  return executeQuery(() =>
    prisma.post.findUnique({
      where: { id: Number(id) }
    })
  );
}

async function create(fields) {
  return executeQuery(() =>
    prisma.post.create({
      data: {
        title: fields.title,
        body: fields.body || '',
        authorId: Number(fields.authorId)
      }
    })
  );
}

async function update(id, patch) {
  const postId = Number(id);

  return executeQuery(async () => {
    const existing = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!existing) return null;

    return prisma.post.update({
      where: { id: postId },
      data: {
        ...(patch.title !== undefined && { title: patch.title }),
        ...(patch.body !== undefined && { body: patch.body })
      }
    });
  });
}

async function remove(id) {
  const postId = Number(id);

  return executeQuery(async () => {
    const existing = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!existing) return false;

    await prisma.post.delete({
      where: { id: postId }
    });

    return true;
  });
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
