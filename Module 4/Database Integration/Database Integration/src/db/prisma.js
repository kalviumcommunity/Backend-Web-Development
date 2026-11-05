const { PrismaClient } = require('@prisma/client');

// One PrismaClient per Node.js application process.
const prisma = new PrismaClient();

module.exports = prisma;
