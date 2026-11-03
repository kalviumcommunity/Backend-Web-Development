// const express = require('express');
// const router = express.Router();

// router.post('/register', async (req, res, next) => {
//   // TODO: validate, hash, persist, and return a safe 201 response.
//   return res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Implement registration' } });
// });

// router.post('/login', async (req, res, next) => {
//   // TODO: verify credentials and return the required generic failure response.
//   return res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Implement login' } });
// });

// module.exports = router;

const express = require('express');
const authService = require('../services/authService');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await authService.login(req.body);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;