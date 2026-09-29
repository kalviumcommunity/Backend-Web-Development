const postRepository = require('../repositories/postRepository');

function listPosts() {
  return postRepository.findAll();
}

function getPost(id) {
  return postRepository.findById(Number(id));
}

function createPost(fields) {
  if (!fields || !fields.title) {
    const error = new Error('Title is required');
    error.statusCode = 422;
    throw error;
  }

  return postRepository.create({
    title: fields.title,
    body: fields.body || '',
    authorId: fields.authorId,
  });
}

function updatePost(id, patch) {
  const safePatch = {};
  if (patch.title !== undefined) safePatch.title = patch.title;
  if (patch.body !== undefined) safePatch.body = patch.body;
  return postRepository.update(Number(id), safePatch);
}

function removePost(id) {
  return postRepository.remove(Number(id));
}

module.exports = { listPosts, getPost, createPost, updatePost, removePost };
