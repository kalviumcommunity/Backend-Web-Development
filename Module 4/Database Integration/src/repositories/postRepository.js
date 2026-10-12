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

function toPostRecord(post) {
  if (!post) return null;
  return {
    id: post.id,
    title: post.title,
    body: post.body,
    authorId: post.authorId,
  };
}

async function findAll() {
  const posts = await prisma.post.findMany({
    orderBy: { id: 'asc' },
  });
  return posts.map(toPostRecord);
}

async function findById(id) {
  const numericId = Number(id);
  const post = await prisma.post.findUnique({
    where: { id: numericId },
  });
  return toPostRecord(post);
}

async function create(fields = {}) {
  try {
    const post = await prisma.post.create({
      data: {
        title: fields.title,
        body: fields.body || '',
        authorId: fields.authorId,
      },
    });
    return toPostRecord(post);
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function update(id, patch = {}) {
  const numericId = Number(id);
  try {
    const post = await prisma.post.update({
      where: { id: numericId },
      data: {
        ...(patch.title !== undefined ? { title: patch.title } : {}),
        ...(patch.body !== undefined ? { body: patch.body } : {}),
      },
    });
    return toPostRecord(post);
  } catch (error) {
    if (error && error.code === 'P2025') return null;
    handleDatabaseError(error);
  }
}

async function remove(id) {
  const numericId = Number(id);
  try {
    await prisma.post.delete({
      where: { id: numericId },
    });
    return true;
  } catch (error) {
    if (error && error.code === 'P2025') return false;
    handleDatabaseError(error);
  }
}

module.exports = { findAll, findById, create, update, remove };
