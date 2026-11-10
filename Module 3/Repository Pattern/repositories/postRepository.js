/**
 * Post repository: the only module that knows how posts are stored.
 * Replacing this Map with Prisma changes this file only; service rules and
 * callers keep the same method names and return contracts.
 */
const records = new Map();
let nextId = 1;

function clone(record) {
  return record == null ? null : { ...record };
}

function findAll() {
  return [...records.values()].map(clone);
}

function findById(id) {
  return clone(records.get(Number(id)) ?? null);
}

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

function remove(id) {
  return records.delete(Number(id));
}

module.exports = { findAll, findById, create, update, remove };
