const express = require('express');
const authService = require('./authService');

const router = express.Router();

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

router.post('/register', async (req, res, next) => {
  const { name, email, password } = req.body || {};
  if (!nonEmptyString(name) || !nonEmptyString(email) || !nonEmptyString(password)) {
    return res.status(400).json({
      error: { code: 'INVALID_INPUT', message: 'Name, email, and password are required' },
    });
  }
  try {
    return res.status(201).json(await authService.register({ name, email, password }));
  } catch (error) {
    if (error.code === 'EMAIL_ALREADY_EXISTS' || error.code === 'P2002') {
      return res.status(409).json({
        error: { code: 'EMAIL_EXISTS', message: 'Email is already registered' },
      });
    }
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body || {};
  if (!nonEmptyString(email) || !nonEmptyString(password)) {
    return res.status(400).json({
      error: { code: 'INVALID_INPUT', message: 'Email and password are required' },
    });
  }
  try {
    return res.status(200).json(await authService.login({ email, password }));
  } catch (error) {
    if (error.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json(authService.INVALID_CREDENTIALS);
    }
    return next(error);
  }
});

module.exports = router;
