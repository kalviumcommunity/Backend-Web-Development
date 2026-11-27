
'use strict';

const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  lazyConnect: true,
});

// Log Redis connection errors without crashing the application
redis.on('error', (err) => {
  console.error('[redis] error:', err.message);
});

// Get data from Redis
async function cacheGet(key) {
  try {
    const value = await redis.get(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value);
  } catch (err) {
    console.error('[cache] GET error:', err.message);
    return null;
  }
}

// Save data with an expiry time
async function cacheSet(key, data, ttlSeconds) {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (err) {
    console.error('[cache] SET error:', err.message);
  }
}

// Delete cached data
async function cacheDel(key) {
  try {
    await redis.del(key);
  } catch (err) {
    console.error('[cache] DEL error:', err.message);
  }
}

module.exports = {
  redis,
  cacheGet,
  cacheSet,
  cacheDel,
};
