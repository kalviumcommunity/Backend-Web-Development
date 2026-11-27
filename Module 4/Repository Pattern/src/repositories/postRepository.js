
const postStore = require('../data/postStore.js');

// Copy the initial posts
const posts = postStore.posts.map((post) => ({ ...post }));

// Generate the next ID
let nextId = Math.max(0, ...posts.map((post) => post.id)) + 1;

// Get all posts
function findAll() {
    return posts.map((post) => ({ ...post }));
}

// Get one post by ID
function findById(id) {
    const post = posts.find((post) => post.id === Number(id));
    return post ? { ...post } : null;
}

// Create a new post
function create(fields) {
    const post = {
        ...fields,
        id: nextId++
    };

    posts.push(post);
    return { ...post };
}

// Update a post
function update(id, patch) {
    const post = posts.find((post) => post.id === Number(id));

    if (!post) return null;

    Object.assign(post, patch);
    return { ...post };
}

// Remove a post
function remove(id) {
    const index = posts.findIndex((post) => post.id === Number(id));

    if (index === -1) return false;

    posts.splice(index, 1);
    return true;
}

// Future Prisma implementation can replace these storage operations
// without changing the service interface.

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};
