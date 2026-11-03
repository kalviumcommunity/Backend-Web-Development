// Map is the authoritative storage.
// The repository owns both storage and ID generation.
// When switching to Prisma, only this repository changes.
// Services continue using the same five-method interface.

const posts = new Map();

let nextId = 1;

function findAll() {
  return Array.from(posts.values());
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