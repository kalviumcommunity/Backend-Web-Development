const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');

function createApp() {
    const app = express();
    app.use(express.json());

    app.use('/', postRoutes);
    app.get('/explode', controller.explode);

    app.use((req, res) => {
        res.status(404).json({
            error: {
                code: 'NOT_FOUND',
                message: 'Route not found'
            }
        });
    });

    app.use((err, req, res, next) => {
        console.error(err);
        if (res.headersSent) return next(err);

        const status = err.statusCode === 400 ? 400 : 500;
        const code = status === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR';
        const message = status === 400 ?
            err instanceof SyntaxError ? 'Request body must be valid JSON' : err.message :
            'An unexpected internal error occurred';
        return res.status(status).json({ error: { code, message } });
    });

    return app;
}

if (require.main === module) {
    const app = createApp();
    const port = 3000;
    app.listen(port, () => {
        console.log(`Starter API listening on port ${port}`);
    });
}

module.exports = {
    createApp,
    resetData
};