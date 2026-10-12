const posts = new Map([
  [1, { id: 1, title: 'First post', body: 'Repository boundaries protect change.', authorId: 7 }],
  [2, { id: 2, title: 'Second post', body: 'Services should speak in domain language.', authorId: 8 }],
]);

let nextId = 3;

// A Prisma implementation will replace this Map and id generation. The repository
// operations and their return values will remain the same for the service layer.
const postRepository = {
  findAll() {
    return Array.from(posts.values());
  },

  findById(id) {
    return posts.get(Number(id)) || null;
  },

  create(fields) {
    const post = { id: nextId++, ...fields };
    posts.set(post.id, post);
    return post;
  },

  update(id, patch) {
    const postId = Number(id);
    const post = posts.get(postId);
    if (!post) return null;

    Object.assign(post, patch);
    return post;
  },

  remove(id) {
    return posts.delete(Number(id));
  },
};

module.exports = postRepository;