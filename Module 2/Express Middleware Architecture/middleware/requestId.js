/**
 * requestId middleware [mount GLOBALLY in app.js]
 *
 * Generates a unique request ID and attaches it to the request.
 */

const { randomUUID } = require('crypto');

module.exports = function requestId(req, res, next) {
    const id = randomUUID();

    req.id = id;

    res.setHeader('X-Request-Id', id);

    next();
};