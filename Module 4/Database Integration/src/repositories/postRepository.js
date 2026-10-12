const prisma = require('../database/prismaClient');

const postFields = { id: true, title: true, body: true, authorId: true };

function translateConstraintError(error) {
  if (error.code === 'P2002') {
    const translated = new Error('A record with the same unique value already exists');
    translated.statusCode = 409;
    return translated;
  }
  if (error.code === 'P2003' || error.code === 'P2014') {
    const translated = new Error('A related record does not exist or cannot be removed');
    translated.statusCode = 409;
    return translated;
  }
  return error;
}

async function withConstraintHandling(operation) {
  try {
    return await operation();
  } catch (error) {
    throw translateConstraintError(error);
  }
}

async function findAll() {
  return prisma.post.findMany({ orderBy: { id: 'asc' }, select: postFields });
}

async function findById(id) {
  const postId = Number(id);
  if (!Number.isInteger(postId)) return null;
  return prisma.post.findUnique({ where: { id: postId }, select: postFields });
}

async function create(fields) {
  return withConstraintHandling(() => prisma.post.create({
    data: { title: fields.title, body: fields.body || '', authorId: fields.authorId },
    select: postFields,
  }));
}

async function update(id, patch) {
  const postId = Number(id);
  if (!Number.isInteger(postId)) return null;
  return withConstraintHandling(async () => {
    const result = await prisma.post.updateMany({
      where: { id: postId },
      data: {
        ...(patch.title !== undefined && { title: patch.title }),
        ...(patch.body !== undefined && { body: patch.body }),
      },
    });
    if (result.count === 0) return null;
    return prisma.post.findUnique({ where: { id: postId }, select: postFields });
  });
}

async function remove(id) {
  const postId = Number(id);
  if (!Number.isInteger(postId)) return false;
  return withConstraintHandling(async () => {
    const result = await prisma.post.deleteMany({ where: { id: postId } });
    return result.count > 0;
  });
}

module.exports = { findAll, findById, create, update, remove };
