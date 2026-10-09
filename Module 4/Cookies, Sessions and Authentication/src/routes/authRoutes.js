const express = require('express');
const bcrypt = require('bcryptjs');
const users = require('../repositories/userRepository');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');
const { cookieOptions, clearCookieOptions } = require('../config/cookieConfig');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const password = String(req.body?.password ?? '');

    if (!email || !password) {
      return res.status(400).json({
        error: { code: 'INVALID_INPUT', message: 'Email and password are required' },
      });
    }

    const user = await users.findByEmail(email);
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!valid) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    }

    const sid = sessionStore.create(user.id);
    res.cookie('sid', sid, cookieOptions());
    return res.status(200).json({
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireSession, (req, res) => {
  res.status(200).json({ data: req.user });
});

router.post('/logout', (req, res) => {
  sessionStore.destroy(req.signedCookies && req.signedCookies.sid);
  res.clearCookie('sid', clearCookieOptions());
  res.status(204).send();
});

module.exports = router;