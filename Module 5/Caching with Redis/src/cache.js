
'use strict';

const Redis = require('ioredis');

// 1. Create Redis instance
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  lazyConnect: true
});

// 2. Get data from Redis
async function cacheGet(key) {
  try {
    const value = await redis.get(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value);

  } catch (error) {
    console.error('[cache] GET error:', error);
    return null;
  }
}

// 3. Store data in Redis
async function cacheSet(key, data, ttlSeconds) {
  try {
    await redis.set(
      key,
      JSON.stringify(data),
      'EX',
      ttlSeconds
    );

  } catch (error) {
    console.error('[cache] SET error:', error);
  }
}

// 4. Delete data from Redis
async function cacheDel(key) {
  try {
    await redis.del(key);

  } catch (error) {
    console.error('[cache] DEL error:', error);
  }
}

module.exports = {
  cacheGet,
  cacheSet,
  cacheDel
};
