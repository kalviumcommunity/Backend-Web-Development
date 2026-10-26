const express = require('express');
const authService = require('./authService');

const router = express.Router();

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasRegistrationInput(body) {
  return body
    && isNonEmptyString(body.name)
    && isNonEmptyString(body.email)
    && isNonEmptyString(body.password);
}

function hasLoginInput(body) {
  return body
    && isNonEmptyString(body.email)
    && isNonEmptyString(body.password);
}

router.post('/register', async (req, res, next) => {
  if (!hasRegistrationInput(req.body)) {
    return res.status(400).json({
      error: { code: 'INVALID_INPUT', message: 'Name, email, and password are required' },
    });
  }

  try {
    const user = await authService.register(req.body);
    return res.status(201).json(user);
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
  if (!hasLoginInput(req.body)) {
    return res.status(400).json({
      error: { code: 'INVALID_INPUT', message: 'Email and password are required' },
    });
  }

  try {
    const user = await authService.login(req.body);
    return res.status(200).json(user);
  } catch (error) {
    if (error.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json(authService.INVALID_CREDENTIALS);
    }
    return next(error);
  }
});

module.exports = router;
