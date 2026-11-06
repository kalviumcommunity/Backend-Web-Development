const prisma = require('../db/prisma');

function numericId(id) {
  const value = Number(id);
  return Number.isSafeInteger(value) ? value : null;
}

function toPostRecord(post) {
  if (!post) return null;
  const record = { id: post.id, title: post.title, body: post.body };
  if (post.authorId !== null && post.authorId !== undefined) record.authorId = post.authorId;
  return record;
}

function throwSafeDatabaseError(error) {
  if (error && error.code === 'P2002') {
    const safeError = new Error('A record with those values already exists.');
    safeError.statusCode = 409;
    throw safeError;
  }

  if (error && (error.code === 'P2003' || error.code === 'P2014')) {
    const safeError = new Error('A related record does not exist or cannot be removed.');
    safeError.statusCode = 409;
    throw safeError;
  }

  // Prisma messages can contain schema and database details. Keep them out of API responses.
  const safeError = new Error('Database operation failed.');
  safeError.statusCode = 500;
  throw safeError;
}

async function findAll() {
  try {
    const posts = await prisma.post.findMany({ orderBy: { id: 'asc' } });
    return posts.map(toPostRecord);
  } catch (error) {
    return throwSafeDatabaseError(error);
  }
}

async function findById(id) {
  const value = numericId(id);
  if (value === null) return null;
  try {
    return toPostRecord(await prisma.post.findUnique({ where: { id: value } }));
  } catch (error) {
    return throwSafeDatabaseError(error);
  }
}

async function create(fields) {
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
    return throwSafeDatabaseError(error);
  }
}

async function update(id, patch) {
  const value = numericId(id);
  if (value === null) return null;
  try {
    const post = await prisma.post.update({
      where: { id: value },
      data: {
        ...(patch.title !== undefined ? { title: patch.title } : {}),
        ...(patch.body !== undefined ? { body: patch.body } : {}),
      },
    });
    return toPostRecord(post);
  } catch (error) {
    if (error && error.code === 'P2025') return null;
    return throwSafeDatabaseError(error);
  }
}

async function remove(id) {
  const value = numericId(id);
  if (value === null) return false;
  try {
    const result = await prisma.post.deleteMany({ where: { id: value } });
    return result.count > 0;
  } catch (error) {
    return throwSafeDatabaseError(error);
  }
}

module.exports = { findAll, findById, create, update, remove };
