require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/db/prisma');

async function main() {
  const passwordHash = await bcrypt.hash('SessionDemo!48', 10);
  await prisma.user.upsert({
    where: { email: 'sam@example.com' },
    update: { name: 'Sam', passwordHash },
    create: { name: 'Sam', email: 'sam@example.com', passwordHash },
  });
  console.log('Demo account: sam@example.com / SessionDemo!48');
}

main().finally(() => prisma.$disconnect());
