// const express = require('express');

// const router = express.Router();

// router.post('/login', async (req, res, next) => {
//   // TODO: validate credentials, create a server session, and set signed `sid` cookie.
//   res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Implement login' } });
// });

// router.get('/me', async (req, res, next) => {
//   // TODO: resolve signed cookie through the server-side session store.
//   res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Implement protected identity' } });
// // });

// router.post('/logout', async (req, res, next) => {
//   // TODO: destroy server session and clear cookie using matching options.
//   res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Implement logout' } });
// });

// module.exports = router;
const express = require('express');
const authService = require('../services/authService');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');
const {
COOKIE_NAME,
cookieOptions,
clearCookieOptions,
} = require('../session/cookieConfig');
const router = express.Router();
router.post('/login', async (req, res, next) => {
try {
const user = await authService.verifyCredentials(req.body); // 1. verify
const session = sessionStore.create(user.id); // 2. create
res.cookie(COOKIE_NAME, session.id, cookieOptions()); // 3. cookie
res.status(200).json({ data: user }); // 4. safe user
} catch (err) {
next(err);
}
});
router.get('/me', requireSession, (req, res) => {
res.status(200).json({ data: req.user });
});
router.post('/logout', (req, res) => {
const sessionId = req.signedCookies[COOKIE_NAME];
sessionStore.destroy(sessionId); // revoke server authority
res.clearCookie(COOKIE_NAME, clearCookieOptions()); // clear browser copy

res.status(204).send();
});
module.exports = router;