
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Find Ada or create her if she does not exist.
  let user = await prisma.user.findFirst({
    where: { name: 'Ada' },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { name: 'Ada' },
    });
  }

  // Check whether the sample posts already exist.
  const firstPost = await prisma.post.findFirst({
    where: { title: 'First post', authorId: user.id },
  });

  if (!firstPost) {
    await prisma.post.create({
      data: {
        title: 'First post',
        body: 'The contract survives storage changes.',
        authorId: user.id,
      },
    });
  }

  const secondPost = await prisma.post.findFirst({
    where: { title: 'Second post', authorId: user.id },
  });

  if (!secondPost) {
    await prisma.post.create({
      data: {
        title: 'Second post',
        body: 'Migrations record database design.',
        authorId: user.id,
      },
    });
  }

  console.log('Seed completed successfully!');
  console.log('User:', user);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
