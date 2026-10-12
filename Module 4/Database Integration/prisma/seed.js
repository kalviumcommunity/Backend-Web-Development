const prisma = require('../src/db/prisma');
const postSeed = require('../src/data/postSeed');

async function main() {
  let author = await prisma.user.findFirst({ orderBy: { id: 'asc' } });
  if (!author) {
    author = await prisma.user.create({ data: { name: 'Community Seed' } });
  }

  const postCount = await prisma.post.count();
  if (postCount === 0) {
    await prisma.post.createMany({
      data: postSeed.map(({ title, body }) => ({
        title,
        body,
        authorId: author.id,
      })),
    });
  }
}

main()
  .catch((error) => {
    console.error('Database seed failed. Check DATABASE_URL and migration status.');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });