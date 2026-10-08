// This repository contains all storage-specific logic.
// When the storage changes from the in-memory store to Prisma,
// only this repository implementation needs to change.
// Services, controllers and routes should keep the same interface.

const postStore = require('../data/postStore');

function findAll() {
  return [...postStore.posts];
}

function findById(id) {
  return postStore.posts.find((post) => post.id === Number(id)) ?? null;
}

function create(fields) {
  const record = {
    id: postStore.nextId(),
    ...fields,
  };
  postStore.posts.push(record);
  return record;
}

function update(id, patch) {
  const post = postStore.posts.find((post) => post.id === Number(id));
  if (!post) {
    return null;
  }
  Object.assign(post, patch);
  return post;
}

function remove(id) {
  const index = postStore.posts.findIndex((post) => post.id === Number(id));
  if (index === -1) {
    return false;
  }
  postStore.posts.splice(index, 1);
  return true;
}

module.exports = { findAll, findById, create, update, remove };
