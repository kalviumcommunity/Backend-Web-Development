const store = require('../data/postStore');

const DEFAULT_LIMIT = 2;
const MAX_LIMIT = 5;

function validationError(message) {
    const error = new Error(message);
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    return error;
}

function listPosts(query = {}) {
    const page = query.page === undefined ? 1 : Number(query.page);
    const limit = query.limit === undefined ? DEFAULT_LIMIT : Number(query.limit);

    if (!Number.isInteger(page) || page < 1) {
        throw validationError('page must be a positive integer');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
        throw validationError(`limit must be an integer between 1 and ${MAX_LIMIT}`);
    }

    const posts = store.getAllPosts();
    const start = (page - 1) * limit;
    const data = posts.slice(start, start + limit);

    return {
        data,
        meta: {
            page,
            limit,
            total: posts.length,
            totalPages: Math.ceil(posts.length / limit)
        }
    };
}

function getPost(id) {
    return store.getPostById(id);
}

function createPost(body = {}) {
    if (
        typeof body.title !== 'string' ||
        body.title.trim() === '' ||
        typeof body.author !== 'string' ||
        body.author.trim() === ''
    ) {
        throw validationError('title and author are required');
    }

    return store.createPost({
        title: body.title.trim(),
        author: body.author.trim()
    });
}

function likePost(id) {
    return store.incrementLikes(id);
}

function explode() {
    const err = new Error('SQLITE_CONSTRAINT in posts table');
    err.statusCode = 500;
    throw err;
}

module.exports = {
    listPosts,
    getPost,
    createPost,
    likePost,
    explode
};