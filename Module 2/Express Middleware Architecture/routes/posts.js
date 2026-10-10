const express = require('express');
const router = express.Router();
const auditWrite = require('../middleware/auditWrite');

// GET /posts — no audit middleware
router.get('/', (req, res) => {
  res.json([]);
});

// POST /posts — audit middleware runs
router.post('/', auditWrite, (req, res) => {
  res.status(201).json(req.body);
});

module.exports = router;