'use strict';

require('dotenv').config();

const express = require('express');
const db = require('./db');

// Import Redis cache functions
const { cacheGet, cacheSet, cacheDel } = require('./cache');

const app = express();
app.use(express.json());

const FEED_KEY = 'feed:trending';
const FEED_TTL = 60;

app.get('/health', (req, res) => res.json({ ok: true }));

// GET /feed — cache-aside implementation
app.get('/feed', async (req, res) => {
  try {
    const t0 = Date.now();

    // 1. Check cache first
    const cached = await cacheGet(FEED_KEY);

    // 2. Cache HIT
    if (cached !== null) {
      console.log(`[feed] HIT ${Date.now() - t0}ms`);
      return res.set('X-Cache', 'HIT').json(cached);
    }

    // 3. Cache MISS — fetch from database
    const posts = await db.getTrendingPosts();

    // 4. Store result in Redis with 60-second TTL
    await cacheSet(FEED_KEY, posts, FEED_TTL);

    console.log(`[feed] MISS ${Date.now() - t0}ms`);

    // 5. Return database result
    res.set('X-Cache', 'MISS').json(posts);

  } catch (err) {
    console.error('[feed] error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /posts — creates a new post and invalidates cache
app.post('/posts', async (req, res) => {
  try {
    const post = await db.createPost(req.body);

    // Invalidate stale cache
    await cacheDel(FEED_KEY);

    res.status(201).json(post);

  } catch (err) {
    console.error('[posts] error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
}

module.exports = { app };