
const prisma = require('../db/prisma');

// Convert the ID into a valid positive integer.
// Invalid IDs behave like records that do not exist.
function getValidId(id) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return null;
  }

  return parsedId;
}

// Convert database errors into safe application errors.
function handleDatabaseError(error) {
  const safeError = new Error('Database operation failed');
  safeError.statusCode = 500;

  if (error.code === 'P2002') {
    safeError.message = 'A record with these details already exists';
    safeError.statusCode = 409;
  } else if (error.code === 'P2003') {
    safeError.message = 'The referenced user or related record does not exist';
    safeError.statusCode = 400;
  }

  return safeError;
}

// Get all posts from PostgreSQL.
async function findAll() {
  try {
    return await prisma.post.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

// Find one post by its ID.
async function findById(id) {
  const validId = getValidId(id);

  if (validId === null) {
    return null;
  }

  try {
    return await prisma.post.findUnique({
      where: {
        id: validId,
      },
    });
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

// Create a new post in PostgreSQL.
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
    throw handleDatabaseError(error);
  }
}

// Update an existing post.
async function update(id, patch) {
  const validId = getValidId(id);

  if (validId === null) {
    return null;
  }

  const data = {};

  if (patch.title !== undefined) {
    data.title = patch.title;
  }

  if (patch.body !== undefined) {
    data.body = patch.body;
  }

  try {
    return await prisma.post.update({
      where: {
        id: validId,
      },
      data,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return null;
    }

    throw handleDatabaseError(error);
  }
}

// Delete a post from PostgreSQL.
async function remove(id) {
  const validId = getValidId(id);

  if (validId === null) {
    return false;
  }

  try {
    await prisma.post.delete({
      where: {
        id: validId,
      },
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
