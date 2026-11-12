/**
 * timing middleware  [mount GLOBALLY in app.js]
 *
 * TODO: export a middleware function (req, res, next) that logs how long the
 *       request took, in milliseconds.
 *   - record a start time at the top (Date.now())
 *   - on the response 'finish' event, log Date.now() - start
 *   - include req.id if it is set
 *   - call next() immediately so the request continues
 *
 * Example line:  [a3f9c1e2] POST /posts took 14ms
 */

function timing(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        console.log(
            `[${req.id}] Request completed in ${duration} ms`
        );
    });

    next();
}

module.exports = timing;