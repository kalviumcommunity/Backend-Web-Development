const authService = require('../services/authService');

function register(req, res, next) {
  authService
    .registerUser(req.body || {})
    .then((user) => res.status(201).json({ user }))
    .catch(next);
}

function login(req, res, next) {
  authService
    .loginUser(req.body || {})
    .then((user) => res.status(200).json({ user }))
    .catch(next);
}

module.exports = { register, login };
