
'use strict';

require('dotenv').config();

const Redis = require('ioredis');

// Create Redis instance
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  lazyConnect: true,
});

redis.on('error', (err) => {
  console.error('Redis error:', err.message);
});

// Get data from Redis cache
async function cacheGet(key) {
  try {
    const value = await redis.get(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value);

  } catch (err) {
    console.error('cacheGet failed:', err.message);
    return null;
  }
}

// Save data to Redis cache with expiration
async function cacheSet(key, data, ttlSeconds) {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (err) {
    console.error('cacheSet failed:', err.message);
  }
}

// Delete data from Redis cache
async function cacheDel(key) {
  try {
    await redis.del(key);
  } catch (err) {
    console.error('cacheDel failed:', err.message);
  }
}

module.exports = { cacheGet, cacheSet, cacheDel };
