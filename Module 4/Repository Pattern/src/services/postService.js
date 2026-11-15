
const postRepo = require('../repositories/postRepository.js');

function listPosts() {
    return postRepo.findAll();
}

function getPost(id) {
    return postRepo.findById(Number(id));
}

function createPost(fields) {
    if (!fields || !fields.title) {
        const error = new Error('Title is required');
        error.statusCode = 422;
        throw error;
    }

    return postRepo.create({
        title: fields.title,
        body: fields.body || '',
        authorId: fields.authorId
    });
}

function updatePost(id, patch) {
    const allowedPatch = {};

    if (patch.title !== undefined) {
        allowedPatch.title = patch.title;
    }

    if (patch.body !== undefined) {
        allowedPatch.body = patch.body;
    }

    return postRepo.update(Number(id), allowedPatch);
}

function removePost(id) {
    return postRepo.remove(Number(id));
}

module.exports = {
    listPosts,
    getPost,
    createPost,
    updatePost,
    removePost
};
