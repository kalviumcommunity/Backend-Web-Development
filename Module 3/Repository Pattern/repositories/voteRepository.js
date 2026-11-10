/**
 * Vote repository: storage and id generation stay private here.
 * A future Prisma adapter can replace this implementation without changing
 * voteService; the standard repository contract remains stable.
 */
const records = new Map();
let nextId = 1;

const clone = (record) => record == null ? null : { ...record };

function findAll() { return [...records.values()].map(clone); }
function findById(id) { return clone(records.get(Number(id)) ?? null); }
function create(fields) {
  const record = { id: nextId++, ...fields };
  records.set(record.id, record);
  return clone(record);
}
function update(id, patch) {
  const key = Number(id);
  const current = records.get(key);
  if (!current) return null;
  const updated = { ...current, ...patch, id: key };
  records.set(key, updated);
  return clone(updated);
}
function remove(id) { return records.delete(Number(id)); }

function findByUserAndPost(userId, postId) {
  const record = [...records.values()].find(
    (vote) => vote.userId === userId && vote.postId === postId
  );
  return clone(record ?? null);
}

module.exports = { findAll, findById, create, update, remove, findByUserAndPost };
