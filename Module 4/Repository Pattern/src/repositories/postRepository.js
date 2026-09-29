// Repository boundary for posts.
//
// When storage changes to Prisma, this file will change.
// Services, controllers, routes, and business rules will remain unchanged.

const posts = new Map([
  [
    1,
    {
      id: 1,
      title: 'First post',
      body: 'Repository boundaries protect change.',
      authorId: 7,
    },
  ],
  [
    2,
    {
      id: 2,
      title: 'Second post',
      body: 'Services should speak in domain language.',
      authorId: 8,
    },
  ],
]);

let nextId = 3;

function findAll() {
  return [...posts.values()].map((post) => ({ ...post }));
}

function findById(id) {
  return posts.get(Number(id)) || null;
}

function create(fields) {
  const post = {
    id: nextId++,
    ...fields,
  };

  posts.set(post.id, post);
  return post;
}

function update(id, patch) {
  const post = findById(id);

  if (!post) return null;

  Object.assign(post, patch);

  return post;
}

function remove(id) {
  return posts.delete(Number(id));
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};