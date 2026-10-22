const express = require('express');
const router = express.Router();

const users = [{ id: 1, name: 'Ada' }];

router.get('/', (req, res) => {
  res.json({ data: users });
});

module.exports = router;
