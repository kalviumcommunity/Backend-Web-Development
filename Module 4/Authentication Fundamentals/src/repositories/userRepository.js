const prisma = require('../db/prisma');

async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email }
  });
}

async function createUser({ name, email, passwordHash }) {
  try {
    return await prisma.user.create({
      data: {
        name,
        email,
        passwordHash
      }
    });
  } catch (error) {
    if (error.code === 'P2002') {
      const duplicateError = new Error('EMAIL_ALREADY_EXISTS');
      duplicateError.code = 'EMAIL_ALREADY_EXISTS';
      throw duplicateError;
    }

    throw error;
  }
}

module.exports = {
  findByEmail,
  createUser
};
