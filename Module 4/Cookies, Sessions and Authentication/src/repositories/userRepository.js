const prisma = require('../db');

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function findPublicById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  return publicUser(user);
}

module.exports = { findByEmail, findPublicById, publicUser };
