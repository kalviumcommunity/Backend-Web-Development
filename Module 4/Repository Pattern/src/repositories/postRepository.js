const postStore = require('../data/postStore');

// Storage-swap boundary:
// When switching to Prisma, only this repository's storage operations change.
// The service interface and its business rules remain unchanged.

const posts = new Map(postStore.posts.map((post) => [post.id, { ...post }]));
let nextId = Math.max(0, ...posts.keys()) + 1;

function findAll() {
  return Array.from(posts.values(), (post) => ({ ...post }));
}

function findById(id) {
  const post = posts.get(Number(id));
  return post ? { ...post } : null;
}

function create(fields) {
  const record = { ...fields, id: nextId++ };
  posts.set(record.id, record);
  return { ...record };
}

function update(id, patch) {
  const key = Number(id);
  const post = posts.get(key);
  if (!post) return null;

  const updated = { ...post, ...patch, id: key };
  posts.set(key, updated);
  return { ...updated };
}

function remove(id) {
  return posts.delete(Number(id));
}

module.exports = { findAll, findById, create, update, remove };

