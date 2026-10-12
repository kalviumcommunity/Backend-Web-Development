const prisma = require('../src/db/prisma');

async function main() {
  let user = await prisma.user.findFirst({ where: { name: 'Threadbase Demo' } });
  if (!user) {
    user = await prisma.user.create({ data: { name: 'Threadbase Demo' } });
  }

  const posts = [
    { title: 'First post', body: 'The contract survives storage changes.' },
    { title: 'Second post', body: 'Migrations record database design.' },
  ];

  for (const post of posts) {
    const existing = await prisma.post.findFirst({
      where: { title: post.title, authorId: user.id },
    });
    if (!existing) {
      await prisma.post.create({ data: { ...post, authorId: user.id } });
    }
  }
}

main()
  .catch((error) => {
    console.error('Database seed failed.', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
