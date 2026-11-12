
// Map-backed repository implementation.

// When replacing this repository with Prisma:
// - The Map storage will be replaced with database queries.
// - ID generation will be handled by Prisma/database.
// - The five repository methods will remain unchanged.
// - The service and controller will not need storage-related changes.

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

// Get all posts
function findAll() {
  return Array.from(posts.values());
}

// Find a post using its ID
function findById(id) {
  return posts.get(Number(id)) || null;
}

// Create a new post
function create(fields) {
  const post = {
    ...fields,
    id: nextId++,
  };

  posts.set(post.id, post);

  return post;
}

// Update an existing post
function update(id, patch) {
  const post = findById(id);

  if (!post) return null;

  const updatedPost = {
    ...post,
    ...patch,
    id: post.id,
  };

  posts.set(post.id, updatedPost);

  return updatedPost;
}

// Remove a post
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
