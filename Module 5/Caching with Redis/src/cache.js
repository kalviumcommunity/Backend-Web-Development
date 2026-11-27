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

// Create Redis instance with lazy connection
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  lazyConnect: true
});

// TODO: implement cacheGet
async function cacheGet(key) {
  try {
    const data = await redis.get(key);

    // Return null when the key does not exist
    if (data === null) {
      return null;
    }

    // Parse and return the cached JSON data
    return JSON.parse(data);

  } catch (err) {
    console.error('[cache] GET error:', err);
    return null;
  }
}

// TODO: implement cacheSet
async function cacheSet(key, data, ttlSeconds) {
  try {
    // Store JSON data with an expiration time
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);

  } catch (err) {
    console.error('[cache] SET error:', err);
  }
}

// TODO: implement cacheDel
async function cacheDel(key) {
  try {
    // Delete the specified cache entry
    await redis.del(key);

  } catch (err) {
    console.error('[cache] DEL error:', err);
  }
}

module.exports = { cacheGet, cacheSet, cacheDel };