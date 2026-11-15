const express = require('express');

function createAuthRoutes(authService) {
  const router = express.Router();

  router.post('/register', async (req, res, next) => {
    try {
      const user = await authService.register(req.body);

      return res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  });

  router.post('/login', async (req, res, next) => {
    try {
      const user = await authService.login(req.body);

      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = createAuthRoutes;