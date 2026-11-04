/**
 * Post Repository (Map-backed Store Implementation)
 *
 * STORAGE-SWAP PROOF:
 * This repository is implemented using an in-memory Map store (swapped from an array),
 * proving that postService depends on the repository contract, not the internal storage technology.
 *
 * PRISMA MIGRATION BOUNDARY COMMENT:
 * -----------------------------------
 * When this repository is replaced by a Prisma-backed implementation:
 *
 * WHAT WILL CHANGE:
 * - Internal storage: The in-memory Map and local nextId counter will be replaced with PrismaClient
 *   queries (e.g. `prisma.post.findMany()`, `prisma.post.findUnique()`, `prisma.post.create()`, etc.).
 * - Asynchrony: Methods will become `async` returning Promises resolving to database records.
 * - Id generation: Delegated entirely to PostgreSQL autoincrement / sequence via Prisma schema.
 * - Concurrency & Persistence: Data will be persistently stored on disk across server restarts
 *   with ACID guarantees.
 *
 * WHAT WILL REMAIN UNCHANGED:
 * - The public repository contract and interface methods (`findAll`, `findById`, `create`, `update`, `remove`).
 * - Method signatures and return value semantics:
 *     - `findAll()` returns an array of post records.
 *     - `findById(id)` returns the record or null if not found.
 *     - `create(fields)` returns the created record with its id.
 *     - `update(id, patch)` returns the updated record or null if not found.
 *     - `remove(id)` returns a boolean indicating whether a record was deleted.
 * - Domain / service business rules in `postService.js`: validation rules (such as requiring a title),
 *   business exceptions, and business workflows remain intact.
 * - Controllers and routes: will continue to interface strictly with `postService`.
 */

// Initial seed data stored in a Map
const store = new Map([
  [1, { id: 1, title: 'First post', body: 'Repository boundaries protect change.', authorId: 7 }],
  [2, { id: 2, title: 'Second post', body: 'Services should speak in domain language.', authorId: 8 }],
]);

let nextId = 3;

/**
 * Returns a new array containing all posts (not the repository's internal reference).
 */
function findAll() {
  return Array.from(store.values()).map((p) => ({ ...p }));
}

/**
 * Returns a post by id or null if not found.
 */
function findById(id) {
  const numericId = Number(id);
  const post = store.get(numericId);
  if (!post) return null;
  return { ...post };
}

/**
 * Creates a record with generated id and returns the complete created record.
 */
function create(fields) {
  const id = nextId++;
  const post = {
    id,
    title: fields.title,
    body: fields.body || '',
    authorId: fields.authorId,
  };
  store.set(id, { ...post });
  return { ...post };
}

/**
 * Updates an existing record with patch data.
 * Returns the updated record or null if the id does not exist.
 */
function update(id, patch) {
  const numericId = Number(id);
  const existing = store.get(numericId);
  if (!existing) return null;

  const updated = {
    ...existing,
    ...(patch.title !== undefined && { title: patch.title }),
    ...(patch.body !== undefined && { body: patch.body }),
  };

  store.set(numericId, updated);
  return { ...updated };
}

/**
 * Removes a record by id.
 * Returns true when a record is removed and false when no record matches.
 */
function remove(id) {
  const numericId = Number(id);
  return store.delete(numericId);
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
