const express = require('express');

const requestId = require('./middleware/requestId');
const logger = require('./middleware/logger');
const timing = require('./middleware/timing');

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

const app = express();

app.use(express.json());

// Global observability pipeline
app.use(requestId);
app.use(logger);
app.use(timing);

// Routers
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
