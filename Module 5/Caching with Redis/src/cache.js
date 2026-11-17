'use strict';

const Redis = require('ioredis');

// Create Redis instance
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  retryStrategy: (attempt) => Math.min(attempt * 100, 1000)
});

let connectionErrorLogged = false;
redis.on('error', (error) => {
  if (!connectionErrorLogged) {
    console.error('Redis connection error:', error.message || error.code || error.name);
    connectionErrorLogged = true;
  }
});
redis.on('ready', () => {
  connectionErrorLogged = false;
});

async function cacheGet(key) {
  try {
    const value = await redis.get(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error('Redis cacheGet error:', error.message);
    return null;
  }
}

async function cacheSet(key, data, ttlSeconds) {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (error) {
    console.error('Redis cacheSet error:', error.message);
  }
}

async function cacheDel(key) {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Redis cacheDel error:', error.message);
  }
}

module.exports = { redis, cacheGet, cacheSet, cacheDel };