const { PrismaClient } = require('@prisma/client');
module.exports = new PrismaClient();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;