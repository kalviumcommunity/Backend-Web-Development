// src/repositories/postRepository.js
const prisma = require('../db/prisma');

async function findAll() {
  return prisma.post.findMany();
}

async function findById(id) {
  return prisma.post.findUnique({ where: { id: Number(id) } });  // returns null if not found
}

async function create(input) {
  return prisma.post.create({ data: input });
}

async function update(id, patch) {
  try {
    return await prisma.post.update({ where: { id: Number(id) }, data: patch });
  } catch (e) {
    if (e.code === 'P2025') return null;  // record not found — preserve null contract
    throw e;
  }
}

async function remove(id) {
  try {
    await prisma.post.delete({ where: { id: Number(id) } });
    return true;
  } catch (e) {
    if (e.code === 'P2025') return false;
    throw e;
  }
}

module.exports = { findAll, findById, create, update, remove };