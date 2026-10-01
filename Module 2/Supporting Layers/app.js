/**
 * articles-api — entry point.
 *
 * Runtime configuration is read exclusively from config/index.js.
 * No process.env references belong here.
 *
 * Run it with:  npm start
 */

'use strict';

const express        = require('express');
const config         = require('./config');          // ← only place config is imported
const articlesRouter = require('./routes/articles');
const errorHandler   = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

app.use('/articles', articlesRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`articles-api listening on http://localhost:${config.port}`);
});

module.exports = app;
