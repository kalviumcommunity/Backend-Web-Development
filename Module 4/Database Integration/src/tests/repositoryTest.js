
const postRepository = require('../repositories/postRepository');

async function main() {
  console.log('\n1. TEST findAll()');
  const posts = await postRepository.findAll();
  console.log('All posts:', posts);

  console.log('\n2. TEST findById()');
  const existingPost = await postRepository.findById(1);
  console.log('Existing post:', existingPost);

  const missingPost = await postRepository.findById(999);
  console.log('Missing post:', missingPost);

  console.log('\n3. TEST create()');
  const newPost = await postRepository.create({
    title: 'Repository Test Post',
    body: 'Testing PostgreSQL create operation.',
    authorId: 1,
  });
  console.log('Created post:', newPost);

  console.log('\n4. TEST update()');
  const updatedPost = await postRepository.update(newPost.id, {
    title: 'Updated Repository Test Post',
  });
  console.log('Updated post:', updatedPost);

  const missingUpdate = await postRepository.update(999, {
    title: 'This should not exist',
  });
  console.log('Missing post update:', missingUpdate);

  console.log('\n5. TEST remove()');
  const removed = await postRepository.remove(newPost.id);
  console.log('Removed successfully:', removed);

  const missingRemove = await postRepository.remove(999);
  console.log('Missing post removed:', missingRemove);

  console.log('\nAll repository tests completed!');
}

main()
  .catch((error) => {
    console.error('Test failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    const prisma = require('../db/prisma');
    await prisma.$disconnect();
  });
