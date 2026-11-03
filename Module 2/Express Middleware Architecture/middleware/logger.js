/**
 * logger middleware [mount GLOBALLY in app.js]
 *
 * Logs request METHOD, PATH, and STATUS when the response finishes.
 */

module.exports = function logger(req, res, next) {
    res.on('finish', () => {
        const id = req.id ? `[${req.id.slice(0, 8)}] ` : '';

        console.log(`${id}${req.method} ${req.path} ${res.statusCode}`);
    });

    next();
};