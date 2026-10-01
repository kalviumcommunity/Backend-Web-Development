const prisma = require('../db/prisma');

async function findAll() {
  return prisma.post.findMany({ orderBy: { id: 'asc' } });
}

async function findById(id) {
  return prisma.post.findUnique({ where: { id: Number(id) } });
}

async function create(fields) {
  return prisma.post.create({
    data: {
      title: fields.title,
      body: fields.body || '',
      authorId: Number(fields.authorId),
    },
  });
}

async function update(id, patch) {
  const existing = await findById(id);
  if (!existing) return null;
  return prisma.post.update({
    where: { id: Number(id) },
    data: {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.body !== undefined ? { body: patch.body } : {}),
    },
  });
}

async function remove(id) {
  const existing = await findById(id);
  if (!existing) return false;
  await prisma.post.delete({ where: { id: Number(id) } });
  return true;
}

module.exports = { findAll, findById, create, update, remove };
