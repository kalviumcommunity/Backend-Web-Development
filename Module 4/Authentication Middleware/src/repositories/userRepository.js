const prisma = require('../db');

function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

function createUser({ name, email, passwordHash }) {
  return prisma.user.create({
    data: { name, email, passwordHash },
  });
}

module.exports = { findByEmail, createUser };
