const prismaModule = require('../db/prisma');
const prisma = prismaModule.prisma || prismaModule;

// Includes passwordHash: used by login only, never returned to the client
function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

function findPublicById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true },
  });
}

module.exports = { findByEmail, findPublicById };