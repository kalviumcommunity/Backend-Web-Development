/*
 * Storage boundary for posts.
 *
 * When this repository is replaced with a Prisma-backed implementation,
 * the internal storage code and id generation change. The repository method
 * names, return shapes, and the service layer stay unchanged.
 */
const postStore = require("../data/postStore");

function findAll() {
  return [...postStore.posts];
}

function findById(id) {
  const post = postStore.posts.find((item) => item.id === Number(id));
  return post || null;
}

function create(fields) {
  const post = {
    id: postStore.nextId(),
    title: fields.title,
    body: fields.body || "",
    authorId: fields.authorId,
  };

  postStore.posts.push(post);
  return post;
}

function update(id, patch) {
  const post = findById(id);
  if (!post) return null;

  if (patch.title !== undefined) post.title = patch.title;
  if (patch.body !== undefined) post.body = patch.body;

  return post;
}

function remove(id) {
  const numericId = Number(id);
  const index = postStore.posts.findIndex((post) => post.id === numericId);

  if (index === -1) return false;

  postStore.posts.splice(index, 1);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
