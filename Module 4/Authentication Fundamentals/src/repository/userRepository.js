const prisma = require('../db/prisma');

/**
 * All Prisma access for users lives here.
 * The rest of the app never touches prisma directly.
 */
async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function findUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function createUser({ name, email, passwordHash }) {
  return prisma.user.create({ data: { name, email, passwordHash } });
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
