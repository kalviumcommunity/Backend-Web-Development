require('dotenv').config();
const Redis = require('ioredis');


// TODO: create Redis instance
// check .env.example for the exact variable name; this is a common one
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  lazyConnect: true,
});
redis.on('error', (err) => console.error('Redis error:', err.message));


// TODO: implement cacheGet
async function cacheGet(key) {
  try {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;   // null on a miss
  } catch (err) {
    console.error('cacheGet failed:', err.message);
    return null;                               // treat errors as a miss
  }
}


// TODO: implement cacheSet
async function cacheSet(key, data, ttlSeconds) {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (err) {
    console.error('cacheSet failed:', err.message);
  }
}


// TODO: implement cacheDel
async function cacheDel(key) {
  try {
    await redis.del(key);
  } catch (err) {
    console.error('cacheDel failed:', err.message);
  }
}


module.exports = { cacheGet, cacheSet, cacheDel };