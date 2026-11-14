const prisma = require('../src/db/prisma');

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: { name: 'Demo User' },
    create: {
      name: 'Demo User',
      email: 'demo@example.com',
    },
  });

  console.log('Demo user ready:', user.id);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
