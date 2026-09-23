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
  return [...posts.values()];
}

function findById(id) {
  return posts.get(Number(id)) || null;
}

function create(fields) {
  const post = {
    id: nextId++,
    title: fields.title,
    body: fields.body || '',
    authorId: fields.authorId,
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
