const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Repository functions: all Prisma queries stay here.
const userRepository = {
  findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  create(data) {
    return prisma.user.create({
      data,
    });
  },
};

module.exports = {
  prisma,
  userRepository,
};