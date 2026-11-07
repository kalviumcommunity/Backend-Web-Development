const { PrismaClient } = require('@prisma/client');

// Keep one client for the lifetime of the application process.
const prisma = new PrismaClient();

module.exports = prisma;
