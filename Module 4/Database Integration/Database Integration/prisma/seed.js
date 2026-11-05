require('dotenv').config();

const prisma = require('../src/db/prisma');

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@example.com',
    },
  });

  const demoPosts = [
    { title: 'First post', body: 'The contract survives storage changes.' },
    { title: 'Second post', body: 'Migrations record database design.' },
  ];

  for (const post of demoPosts) {
    const existing = await prisma.post.findFirst({
      where: { title: post.title, authorId: user.id },
      select: { id: true },
    });

    if (!existing) {
      await prisma.post.create({ data: { ...post, authorId: user.id } });
    }
  }

  console.log('Seed data inserted.');
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error.code || error.name || 'UnknownError');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
