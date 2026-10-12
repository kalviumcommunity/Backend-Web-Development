const postRepository = require('../data/postRepository');

function listPosts() {
  return postRepository.listPosts();
}

function getPost(id) {
  return postRepository.getPost(id);
}

function createPost(fields) {
  if (!fields || !fields.title) {
    const error = new Error('Title is required');
    error.statusCode = 422;
    throw error;
  }

  return postRepository.createPost({
    title: fields.title,
    body: fields.body || '',
    authorId: fields.authorId,
  });
}

function updatePost(id, patch) {
  return postRepository.updatePost(id, patch);
}

function removePost(id) {
  return postRepository.removePost(id);
}

module.exports = { listPosts, getPost, createPost, updatePost, removePost };
