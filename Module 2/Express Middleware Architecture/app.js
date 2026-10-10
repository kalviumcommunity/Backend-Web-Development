const express = require('express');

const requestId = require('./middleware/requestId');
const logger = require('./middleware/logger');
const timing = require('./middleware/timing');

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

// Create the Express app FIRST
const app = express();

app.use(express.json());

// Global middleware — order matters
app.use(requestId);
app.use(logger);
app.use(timing);

// Mount routers AFTER middleware
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

// Start the server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;