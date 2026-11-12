/*
 * Repository boundary for posts.
 *
 * When this repository is replaced by a Prisma-backed implementation:
 * - What changes: only the internals of this file (the private in-memory store
 *   and nextId counter become PrismaClient queries against the database, and
 *   methods become async/Promise-based with database-generated IDs).
 * - What remains unchanged: the five-method repository interface (findAll,
 *   findById, create, update, remove), their return shapes (array, record or
 *   null, created record, updated record or null, boolean), and all services
 *   and controllers above this boundary (validation, status codes, responses).
 */

const posts = [
  { id: 1, title: 'First post', body: 'Repository boundaries protect change.', authorId: 7 },
  { id: 2, title: 'Second post', body: 'Services should speak in domain language.', authorId: 8 },
];

let nextId = 3;

function toNumericId(id) {
  if (id === null || id === undefined || typeof id === 'boolean') return null;
  if (typeof id === 'string' && id.trim() === '') return null;
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
}

function findAll() {
  return posts.map((post) => ({ ...post }));
}

function findById(id) {
  const numericId = toNumericId(id);
  if (numericId === null) return null;
  const post = posts.find((item) => item.id === numericId);
  return post ? { ...post } : null;
}

function create(fields) {
  const { id: _ignoredId, ...rest } = fields || {};
  const record = { id: nextId++, ...rest };
  posts.push(record);
  return { ...record };
}

function update(id, patch) {
  const numericId = toNumericId(id);
  if (numericId === null) return null;
  const post = posts.find((item) => item.id === numericId);
  if (!post) return null;

  for (const [key, value] of Object.entries(patch || {})) {
    if (key !== 'id' && value !== undefined) {
      post[key] = value;
    }
  }
  return { ...post };
}

function remove(id) {
  const numericId = toNumericId(id);
  if (numericId === null) return false;
  const index = posts.findIndex((item) => item.id === numericId);
  if (index === -1) return false;
  posts.splice(index, 1);
  return true;
}

module.exports = { findAll, findById, create, update, remove };
