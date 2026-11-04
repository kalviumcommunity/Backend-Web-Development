require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const author = await prisma.user.upsert({
    where: { id: 1 },
    update: { name: 'Seed Author' },
    create: { id: 1, name: 'Seed Author' },
  });

  const posts = [
    { id: 1, title: 'First post', body: 'The contract survives storage changes.' },
    { id: 2, title: 'Second post', body: 'Migrations record database design.' },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: { ...post, authorId: author.id },
      create: { ...post, authorId: author.id },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());