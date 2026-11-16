
'use strict';

require('dotenv').config();

const express = require('express');
const db = require('./db');
const { cacheGet, cacheSet, cacheDel } = require('./cache');

const app = express();
app.use(express.json());

const FEED_KEY = 'feed:trending';
const FEED_TTL = 60;

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/feed', async (req, res) => {
  try {
    // 1. Check Redis cache
    const cachedPosts = await cacheGet(FEED_KEY);

    if (cachedPosts !== null) {
      res.set('X-Cache', 'HIT');
      console.log('[feed] Cache HIT');
      return res.json(cachedPosts);
    }

    // 2. Cache miss: fetch from database
    const t0 = Date.now();
    const posts = await db.getTrendingPosts();

    console.log(`[feed] DB MISS ${Date.now() - t0}ms`);

    // 3. Save result in Redis
    await cacheSet(FEED_KEY, posts, FEED_TTL);

    res.set('X-Cache', 'MISS');
    return res.json(posts);

  } catch (err) {
    console.error('[feed] error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/posts', async (req, res) => {
  try {
    const post = await db.createPost(req.body);

    // Invalidate cached feed
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
