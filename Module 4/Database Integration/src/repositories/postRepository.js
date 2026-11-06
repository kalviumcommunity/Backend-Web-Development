const prisma = require('../db/prisma');

async function findAll() {
  return prisma.post.findMany();
}

async function findById(id) {
  return prisma.post.findUnique({
    where: { id: Number(id) },
  });
}

async function create(fields) {
  return prisma.post.create({
    data: {
      title: fields.title,
      body: fields.body || '',
      authorId: fields.authorId,
    },
  });
}

async function update(id, patch) {
  const existingPost = await findById(id);

  if (!existingPost) return null;

  return prisma.post.update({
    where: { id: Number(id) },
    data: {
      ...(patch.title !== undefined && { title: patch.title }),
      ...(patch.body !== undefined && { body: patch.body }),
    },
  });
}

async function remove(id) {
  const existingPost = await findById(id);

  if (!existingPost) return false;

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