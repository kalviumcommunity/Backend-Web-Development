const prisma = require('../db/prisma');

// Keep the repository contract stable. Select only the fields returned by
// the original in-memory repository so database metadata does not change API responses.
const postFields = {
  id: true,
  title: true,
  body: true,
  authorId: true,
};

async function findAll() {
  return prisma.post.findMany({
    select: postFields,
    orderBy: { id: 'asc' },
  });
}

async function findById(id) {
  return prisma.post.findUnique({
    where: { id: Number(id) },
    select: postFields,
  });
}

async function create(fields) {
  return prisma.post.create({
    data: {
      title: fields.title,
      body: fields.body || '',
      authorId: Number(fields.authorId),
    },
    select: postFields,
  });
}

async function update(id, patch) {
  // updateMany lets us preserve the old contract: return null if no row exists.
  const result = await prisma.post.updateMany({
    where: { id: Number(id) },
    data: {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.body !== undefined ? { body: patch.body } : {}),
    },
  });

  if (result.count === 0) return null;
  return findById(id);
}

async function remove(id) {
  // deleteMany returns a count rather than throwing P2025 for missing records.
  const result = await prisma.post.deleteMany({
    where: { id: Number(id) },
  });
  return result.count > 0;
}

module.exports = { findAll, findById, create, update, remove };
