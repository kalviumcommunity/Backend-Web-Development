
'use strict';

require('dotenv').config();

const express = require('express');
const db = require('./db');
const { cacheGet, cacheSet, cacheDel } = require('./cache');

const app = express();
app.use(express.json());

const FEED_KEY = 'feed:trending';
const FEED_TTL = 60; // seconds

app.get('/health', (req, res) => res.json({ ok: true }));

// GET /feed — cache-aside pattern
app.get('/feed', async (req, res) => {
  const t0 = Date.now();

  try {
    const cached = await cacheGet(FEED_KEY);

    if (cached !== null) {
      res.set('X-Cache', 'HIT');
      console.log(`[feed] HIT ${Date.now() - t0}ms`);
      return res.json(cached);
    }

    const posts = await db.getTrendingPosts();

    await cacheSet(FEED_KEY, posts, FEED_TTL);

    res.set('X-Cache', 'MISS');
    console.log(`[feed] MISS ${Date.now() - t0}ms`);
    return res.json(posts);
  } catch (err) {
    console.error('[feed] error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /posts — create a post and invalidate the feed cache
app.post('/posts', async (req, res) => {
  try {
    const post = await db.createPost(req.body);
    await cacheDel(FEED_KEY);
    return res.status(201).json(post);
  } catch (err) {
    console.error('[posts] error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
}

module.exports = { app };
