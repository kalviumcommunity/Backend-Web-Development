
'use strict';

// ─── GIVEN FILE — modify only to add caching (do not remove existing code) ───
// This file sets up the Express app and two routes.
// Your job: import cacheGet/cacheSet/cacheDel from ./cache and wire up:
//   GET /feed  → cache-aside with 60s TTL and X-Cache header
//   POST /posts → cacheDel after db.createPost()

require('dotenv').config();

const express = require('express');
const db = require('./db');

// Import Redis cache helpers
const { cacheGet, cacheSet, cacheDel } = require('./cache');

const app = express();
app.use(express.json());

const FEED_KEY = 'feed:trending';
const FEED_TTL = 60; // seconds

app.get('/health', (req, res) => res.json({ ok: true }));

// GET /feed — cache-aside pattern
app.get('/feed', async (req, res) => {
  try {
    const t0 = Date.now();

    // Step 1: Check Redis cache
    const cached = await cacheGet(FEED_KEY);

    // Step 2: Cache HIT
    if (cached !== null) {
      const ms = Date.now() - t0;

      console.log(`[feed] HIT ${ms}ms`);

      return res
        .set('X-Cache', 'HIT')
        .json(cached);
    }

    // Step 3: Cache MISS — fetch from database
    const posts = await db.getTrendingPosts();

    // Step 4: Store result in Redis for 60 seconds
    await cacheSet(FEED_KEY, posts, FEED_TTL);

    const ms = Date.now() - t0;

    console.log(`[feed] MISS ${ms}ms`);

    return res
      .set('X-Cache', 'MISS')
      .json(posts);

  } catch (err) {
    console.error('[feed] error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /posts — creates a new post
app.post('/posts', async (req, res) => {
  try {
    const post = await db.createPost(req.body);

    // Invalidate cache after creating a post
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
