const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('../generated/prisma');

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
module.exports = new PrismaClient({ adapter });
