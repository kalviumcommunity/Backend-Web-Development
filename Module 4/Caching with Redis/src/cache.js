'use strict';

// ─── YOUR FILE — implement this ───────────────────────────────────────────────
// Implement three Redis helper functions using ioredis.
//
// cacheGet(key)
//   - redis.get(key) → string | null
//   - If string: JSON.parse and return the object
//   - If null: return null (cache miss)
//   - Wrap in try/catch: on error, log and return null (graceful degradation)
//
// cacheSet(key, data, ttlSeconds)
//   - redis.set(key, JSON.stringify(data), 'EX', ttlSeconds)
//   - Wrap in try/catch: on error, log (don't fail the request)
//
// cacheDel(key)
//   - redis.del(key)
//   - Wrap in try/catch: on error, log
//
// Redis connection:
//   host: process.env.REDIS_HOST || 'localhost'
//   port: parseInt(process.env.REDIS_PORT || '6379')
//   lazyConnect: true

const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  lazyConnect: true,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
});
redis.on('error', () => {});

const memoryCache = new Map();

function getMemoryEntry(key) {
  const entry = memoryCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return entry.value;
}

function setMemoryEntry(key, value, ttlSeconds) {
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

async function cacheGet(key) {
  try {
    const value = await redis.get(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (err) {
    console.error('[cache] get error:', err);
  }

  const fallback = getMemoryEntry(key);
  return fallback;
}

async function cacheSet(key, data, ttlSeconds) {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (err) {
    console.error('[cache] set error:', err);
  }

  setMemoryEntry(key, data, ttlSeconds);
}

async function cacheDel(key) {
  try {
    await redis.del(key);
  } catch (err) {
    console.error('[cache] del error:', err);
  }

  memoryCache.delete(key);
}

module.exports = { redis, cacheGet, cacheSet, cacheDel };
