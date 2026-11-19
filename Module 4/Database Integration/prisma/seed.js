const prisma = require('@prisma/client').PrismaClient;
const db = new prisma();

async function main() {
  let user = await db.user.findFirst({
    where: { name: 'Community Member' },
  });

  if (!user) {
    user = await db.user.create({
      data: { name: 'Community Member' },
    });
  }

  const seedPosts = require('../src/data/postSeed');

  for (const post of seedPosts) {
    const existing = await db.post.findFirst({
      where: {
        title: post.title,
        authorId: user.id,
      },
    });

    if (!existing) {
      await db.post.create({
        data: {
          title: post.title,
          body: post.body,
          authorId: user.id,
        },
      });
    }
  }

  console.log('Database seed completed');
}

main()
  .catch((error) => {
    console.error('Database seeding failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });