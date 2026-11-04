// Map-backed repository.
// When switching to Prisma, only this storage implementation changes.
// The five repository operations and their return contracts remain unchanged.
// Business rules and validation stay in the service.

const posts = new Map([
  [1, {
    id: 1,
    title: 'First post',
    body: 'Repository boundaries protect change.',
    authorId: 7,
  }],
  [2, {
    id: 2,
    title: 'Second post',
    body: 'Services should speak in domain language.',
    authorId: 8,
  }],
]);

let nextId = 3;

function findAll() {
  return Array.from(posts.values());
}

function findById(id) {
  return posts.get(Number(id)) || null;
}

function create(fields) {
  const id = nextId++;

  const post = {
    ...fields,
    id,
  };

  posts.set(id, post);

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