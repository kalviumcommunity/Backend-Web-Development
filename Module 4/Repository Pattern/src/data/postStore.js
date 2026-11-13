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

// Repository boundary:
// When switching to Prisma, only this repository implementation changes.
// The five-method contract remains the same, so services, controllers,
// business rules, and API response shapes do not need to change.

const postRepository = {
  findAll() {
    return [...posts.values()];
  },

  findById(id) {
    return posts.get(Number(id)) || null;
  },

  create(fields) {
    const post = {
      ...fields,
      id: nextId++,
    };

    posts.set(post.id, post);
    return post;
  },

  update(id, patch) {
    const post = this.findById(id);

    if (!post) {
      return null;
    }

    const updatedPost = {
      ...post,
      ...patch,
      id: post.id,
    };

    posts.set(post.id, updatedPost);
    return updatedPost;
  },

  remove(id) {
    return posts.delete(Number(id));
  },
};

module.exports = postRepository;