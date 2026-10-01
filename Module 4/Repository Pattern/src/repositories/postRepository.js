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

/*
 * This repository currently uses an in-memory Map.
 * When Prisma replaces this implementation, only the storage operations
 * inside this repository will change. The service layer's business rules,
 * validation, method calls, and expected return values will remain unchanged.
 */

function findAll() {
  return Array.from(posts.values());
}

function findById(id) {
  return posts.get(Number(id)) || null;
}

function create(fields) {
  const id = nextId++;

  const post = {
    id,
    ...fields,
  };

  posts.set(id, post);

  return post;
}

function update(id, patch) {
  const numericId = Number(id);
  const post = posts.get(numericId);

  if (!post) return null;

  if (patch.title !== undefined) {
    post.title = patch.title;
  }

  if (patch.body !== undefined) {
    post.body = patch.body;
  }

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