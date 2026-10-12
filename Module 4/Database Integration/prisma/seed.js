const prisma = require('../src/database/prismaClient');
const seedPosts = require('../src/data/postSeed');

async function main() {
  const author = await prisma.user.upsert({
    where: { email: 'seed-author@example.test' },
    update: { name: 'Community Seed Author' },
    create: { name: 'Community Seed Author', email: 'seed-author@example.test' },
  });

  for (const post of seedPosts) {
    const existingPost = await prisma.post.findFirst({
      where: { title: post.title, body: post.body, authorId: author.id },
    });
    if (!existingPost) {
      await prisma.post.create({
        data: { title: post.title, body: post.body, authorId: author.id },
      });
    }
  }
}

main()
  .catch((error) => {
    console.error('Database seed failed');
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());