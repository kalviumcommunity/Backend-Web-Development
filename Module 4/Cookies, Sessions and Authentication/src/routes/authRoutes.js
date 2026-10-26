const express = require('express');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  // TODO: validate credentials, create a server session, and set signed `sid` cookie.
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'Email and password are required'
        }
      });
    }

    const user = await req.app.locals.userStore.findByEmail(email);

    if (!user || !(await req.app.locals.passwordVerifier(password, user.passwordHash))) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    req.session.regenerate((err) => {
      if (err) return next(err);

      req.session.userId = user.id;

      req.session.save((err) => {
        if (err) return next(err);

        return res.status(200).json({
          message: 'Login successful',
          user: {
            id: user.id,
            email: user.email
          }
        });
      });
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', async (req, res, next) => {
  // TODO: resolve signed cookie through the server-side session store.
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    const user = await req.app.locals.userStore.findById(
      req.session.userId
    );

    if (!user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not found'
        }
      });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  // TODO: destroy server session and clear cookie using matching options.
  try {
    if (!req.session) {
      return res.status(200).json({
        message: 'Logout successful'
      });
    }

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie('sid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });

      return res.status(200).json({
        message: 'Logout successful'
      });
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;