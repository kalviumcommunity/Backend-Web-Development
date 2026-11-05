const prisma = require("../utils/prisma");

const findByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

const createUser = async (data) => {
  return prisma.user.create({
    data
  });
};

module.exports = {
  findByEmail,
  createUser
};