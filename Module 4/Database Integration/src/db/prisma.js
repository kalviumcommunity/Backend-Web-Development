const { PrismaClient } = require('@prisma/client');

// Reuse one client for the lifetime of this application process.
const prisma = globalThis.__communityPrisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__communityPrisma = prisma;
}

module.exports = prisma;
