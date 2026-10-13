const postService = require('../services/postService');

function sendError(res, error) {
  if (error.statusCode) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  return res.status(500).json({ error: 'Internal server error' });
}

async function list(req, res) {
  try {
    return res.json({ data: await postService.listPosts() });
  } catch (error) {
    return sendError(res, error);
  }
}

async function get(req, res) {
  try {
    const post = await postService.getPost(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.json({ data: post });
  } catch (error) {
    return sendError(res, error);
  }
}

async function create(req, res) {
  try {
    const post = await postService.createPost(req.body);
    return res.status(201).json({ data: post });
  } catch (error) {
    return sendError(res, error);
  }
}

async function update(req, res) {
  try {
    const post = await postService.updatePost(req.params.id, req.body);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.json({ data: post });
  } catch (error) {
    return sendError(res, error);
  }
}

async function remove(req, res) {
  try {
    const removed = await postService.removePost(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Post not found' });
    return res.status(204).send();
  } catch (error) {
    return sendError(res, error);
  }
}

module.exports = { list, get, create, update, remove };
