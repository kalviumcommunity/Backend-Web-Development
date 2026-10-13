
const prisma = require('../db/prisma');

async function findAll() {
  return prisma.post.findMany({
    orderBy: { id: 'asc' },
  });
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
        authorId: Number(fields.authorId),
      },
    });
  } catch (error) {
    if (error.code === 'P2003') {
      const safeError = new Error('Invalid authorId: author does not exist');
      safeError.statusCode = 400;
      throw safeError;
    }

    if (error.code === 'P2002') {
      const safeError = new Error('A record with these details already exists');
      safeError.statusCode = 409;
      throw safeError;
    }

    throw error;
  }
}

async function update(id, patch) {
  const existing = await findById(id);
  if (!existing) return null;

  const data = {};

  if (patch.title !== undefined) data.title = patch.title;
  if (patch.body !== undefined) data.body = patch.body;

  return prisma.post.update({
    where: { id: Number(id) },
    data,
  });
}

async function remove(id) {
  const existing = await findById(id);
  if (!existing) return false;

  await prisma.post.delete({
    where: { id: Number(id) },
  });

  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
