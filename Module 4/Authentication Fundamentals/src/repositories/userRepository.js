const prisma = require('../db/prisma');

const findByEmail = (email) => prisma.user.findUnique({ where: { email } });

const create = ({ name, email, passwordHash }) =>
  prisma.user.create({ data: { name, email, passwordHash } });

module.exports = { findByEmail, create };
