const store = require('../data/postStore');

function listPosts(query = {}) {
const requestedPage = Number.parseInt(query.page, 10);
const requestedLimit = Number.parseInt(query.limit, 10);

const page = Number.isFinite(requestedPage) && requestedPage > 0
? requestedPage
: 1;

const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
? Math.min(requestedLimit, 100)
: 10;

const allPosts = store.getAllPosts();
const total = allPosts.length;
const pages = Math.ceil(total / limit);

const startIndex = (page - 1) * limit;
const data = allPosts.slice(startIndex, startIndex + limit);

return {
data,
meta: {
page,
limit,
total,
pages
}
};
}

function getPost(id) {
return store.getPostById(id);
}

function createPost(body = {}) {
return store.createPost({
title: body.title,
author: body.author
});
}

function likePost(id) {
const post = store.incrementLikes(id);

if (!post) {
const err = new Error('Post not found');
err.statusCode = 404;
err.code = 'NOT_FOUND';
throw err;
}

return post;
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
