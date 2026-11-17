'use strict';

const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  lazyConnect: true,
});

redis.on('error', (err) => {
  console.error('[cache] Redis error:', err.message);
});

async function cacheGet(key) {
  try {
    const data = await redis.get(key);
    return data === null ? null : JSON.parse(data);
  } catch (err) {
    console.error('[cache] GET error:', err.message);
    return null;
  }
}

async function cacheSet(key, data, ttlSeconds) {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (err) {
    console.error('[cache] SET error:', err.message);
  }
}

async function cacheDel(key) {
  try {
    await redis.del(key);
  } catch (err) {
    console.error('[cache] DEL error:', err.message);
  }
}

module.exports = { cacheGet, cacheSet, cacheDel, redis };
