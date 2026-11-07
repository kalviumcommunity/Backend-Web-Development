'use strict';

const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    lazyConnect: true
});

// Get data from Redis
async function cacheGet(key) {
    try {
        const val = await redis.get(key);
        return val ? JSON.parse(val) : null;
    } catch (error) {
        console.error('Redis GET error:', error);
        return null;
    }
}

// Store data with TTL
async function cacheSet(key, data, ttlSeconds) {
    try {
        await redis.set(
            key,
            JSON.stringify(data),
            'EX',
            ttlSeconds
        );
    } catch (error) {
        console.error('Redis SET error:', error);
    }
}

// Delete cached data
async function cacheDel(key) {
    try {
        await redis.del(key);
    } catch (error) {
        console.error('Redis DEL error:', error);
    }
}

module.exports = {
    redis,
    cacheGet,
    cacheSet,
    cacheDel
};
