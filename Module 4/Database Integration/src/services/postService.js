const postRepository = require('../repositories/postRepository');

async function listPosts() {
  return await postRepository.findAll();
}

async function getPost(id) {
  return await postRepository.findById(id);
}

async function createPost(fields) {
  if (!fields || !fields.title) {
    const error = new Error('Title is required');
    error.statusCode = 422;
    throw error;
  }

  return await postRepository.create({
    title: fields.title,
    body: fields.body || '',
    authorId: fields.authorId,
  });
}

async function updatePost(id, patch) {
  return await postRepository.update(id, patch);
}

async function removePost(id) {
  return await postRepository.remove(id);
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  updatePost,
  removePost,
};