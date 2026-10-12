const prisma = require('../src/lib/prisma');

async function main() {
  const user = await prisma.user.upsert({
    where: {
      id: 1,
    },
    update: {
      name: 'Demo User',
    },
    create: {
      id: 1,
      name: 'Demo User',
    },
  });

  await prisma.post.upsert({
    where: {
      id: 1,
    },
    update: {
      title: 'First post',
      body: 'The contract survives storage changes.',
      authorId: user.id,
    },
    create: {
      id: 1,
      title: 'First post',
      body: 'The contract survives storage changes.',
      authorId: user.id,
    },
  });

  await prisma.post.upsert({
    where: {
      id: 2,
    },
    update: {
      title: 'Second post',
      body: 'Migrations record database design.',
      authorId: user.id,
    },
    create: {
      id: 2,
      title: 'Second post',
      body: 'Migrations record database design.',
      authorId: user.id,
    },
  });

  await prisma.$executeRawUnsafe(`
    SELECT setval(
      pg_get_serial_sequence('"User"', 'id'),
      COALESCE((SELECT MAX(id) FROM "User"), 0) + 1,
      false
    );
  `);

  await prisma.$executeRawUnsafe(`
    SELECT setval(
      pg_get_serial_sequence('"Post"', 'id'),
      COALESCE((SELECT MAX(id) FROM "Post"), 0) + 1,
      false
    );
  `);

  console.log('Database seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
