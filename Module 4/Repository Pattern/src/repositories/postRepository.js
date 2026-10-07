const posts = new Map([
  [1, { id: 1, title: 'First post', body: 'Repository boundaries protect change.', authorId: 7 }],
  [2, { id: 2, title: 'Second post', body: 'Services should speak in domain language.', authorId: 8 }],
]);

let nextId = 3;

function findAll() {
  return Array.from(posts.values());
}

function findById(id) {
  return posts.get(Number(id)) ?? null;
}

function create(fields) {
  const data = fields || {};
  const post = {
    id: nextId++,
    title: data.title,
    body: data.body || '',
    authorId: data.authorId,
  };

  posts.set(post.id, post);
  return post;
}

function update(id, patch) {
  const post = posts.get(Number(id));
  if (!post) return null;

  const updateFields = patch || {};
  if (updateFields.title !== undefined) post.title = updateFields.title;
  if (updateFields.body !== undefined) post.body = updateFields.body;

  return post;
}

function remove(id) {
  const recordId = Number(id);
  if (!posts.has(recordId)) return false;

  posts.delete(recordId);
  return true;
}

module.exports = { findAll, findById, create, update, remove };
