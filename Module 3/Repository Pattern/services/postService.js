const postRepository = require('../repositories/postRepository');

async function listPosts() {
  return postRepository.findAll();
}

async function getPost(id) {
  return postRepository.findById(id);
}

async function publishPost(fields) {
  return postRepository.create(fields);
}

async function editPost(id, patch) {
  return postRepository.update(id, patch);
}

async function deletePost(id) {
  return postRepository.remove(id);
}

module.exports = { listPosts, getPost, publishPost, editPost, deletePost };
