const prisma = require('../db/prisma');
const seedPosts = require('./postSeed');

async function seed() {
  const author = await prisma.user.upsert({
    where: { email: 'seed@example.test' },
    update: {},
    create: { name: 'Seed User', email: 'seed@example.test' },
  });

  for (const post of seedPosts) {
    const existing = await prisma.post.findFirst({
      where: { authorId: author.id, title: post.title },
    });
    if (!existing) {
      await prisma.post.create({
        data: { title: post.title, body: post.body, authorId: author.id },
      });
    }
  }
}

seed()
  .catch((error) => {
    console.error('Database seeding failed');
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
