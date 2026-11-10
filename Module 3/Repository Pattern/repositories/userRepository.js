/**
 * User repository: storage details and id generation are private.
 * A Prisma-backed implementation can preserve these method contracts so
 * services and controllers do not need to change during a storage swap.
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

function findByUsername(username) {
  const record = [...records.values()].find((user) => user.username === username);
  return clone(record ?? null);
}

module.exports = { findAll, findById, create, update, remove, findByUsername };
