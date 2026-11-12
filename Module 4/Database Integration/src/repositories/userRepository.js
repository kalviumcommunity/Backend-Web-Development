const prisma = require('../db/prisma');

function createEmailConflictError() {
  const error = new Error('Email already registered');
  error.statusCode = 409;
  error.code = 'EMAIL_ALREADY_EXISTS';
  error.isPublicAuthError = true;
  return error;
}

async function create(fields) {
  try {
    return await prisma.user.create({ data: fields });
  } catch (error) {
    if (error.code === 'P2002') {
      throw createEmailConflictError();
    }
    throw error;
  }
}

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

module.exports = { create, findByEmail };
