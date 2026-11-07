const prisma = require('../src/db/prisma');

async function main() {
  await prisma.user.upsert({
    where: { email: 'demo@threadbase.dev' },
    update: {},
    create: { name: 'Demo User', email: 'demo@threadbase.dev' },
  });
  console.log('Seeded demo user');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());