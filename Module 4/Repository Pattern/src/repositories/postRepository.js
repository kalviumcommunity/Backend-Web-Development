// Replacing this Map with Prisma changes persistence behind the same five-method repository boundary; service business rules, controllers, routes, and externally visible API behavior remain unchanged. An async Prisma client may require Promise propagation while keeping this boundary intact.
const posts = new Map([
  [1, { id: 1, title: 'First post', body: 'Repository boundaries protect change.', authorId: 7 }],
  [2, { id: 2, title: 'Second post', body: 'Services should speak in domain language.', authorId: 8 }],
]);

let nextId = 3;

function findAll() {
  return Array.from(posts.values());
}

function findById(id) {
  return posts.get(Number(id)) || null;
}

function create(fields) {
  const post = {
    id: nextId++,
    title: fields.title,
    body: fields.body,
    authorId: fields.authorId,
  };
  posts.set(post.id, post);
  return post;
}

function update(id, patch) {
  const post = findById(id);
  if (!post) return null;
  for (const [field, value] of Object.entries(patch)) {
    if (field !== 'id') post[field] = value;
  }
  return post;
}

function remove(id) {
  return posts.delete(Number(id));
}

module.exports = { findAll, findById, create, update, remove };