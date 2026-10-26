
const express = require('express');
const authService = require('../services/authService');
const AppError = require('../Errors/AppError');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      !authService.isNonEmptyString(name) ||
      !authService.isNonEmptyString(email) ||
      !authService.isNonEmptyString(password)
    ) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Name, email, and password are required'
      );
    }

    const user = await authService.registerUser({ name, email, password });

    return res.status(201).json({ data: user });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (
      !authService.isNonEmptyString(email) ||
      !authService.isNonEmptyString(password)
    ) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Email and password are required'
      );
    }

    const user = await authService.loginUser({ email, password });

    return res.status(200).json({ data: user });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
