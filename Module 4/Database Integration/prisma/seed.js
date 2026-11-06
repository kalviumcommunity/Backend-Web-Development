require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: 1 },
    update: { name: 'Community author' },
    create: { id: 1, name: 'Community author' },
  });

  const starterPosts = [
    { id: 1, title: 'First post', body: 'The contract survives storage changes.', authorId: 1 },
    { id: 2, title: 'Second post', body: 'Migrations record database design.', authorId: 1 },
  ];

  for (const post of starterPosts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {
        title: post.title,
        body: post.body,
        authorId: post.authorId,
      },
      create: post,
    });
  }

  // Explicit starter IDs must not leave PostgreSQL sequences behind the seeded rows.
  await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('"User"', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM "User"), 1), 1), true)`;
  await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('"Post"', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM "Post"), 1), 1), true)`;
}

main()
  .catch((error) => {
    console.error('Database seed failed. Check the database connection and migration status.');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
