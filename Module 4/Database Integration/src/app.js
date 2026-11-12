require('dotenv').config();

const express = require('express');
const postController = require('./controllers/postController');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.get('/posts', postController.list);
app.get('/posts/:id', postController.get);
app.post('/posts', postController.create);
app.patch('/posts/:id', postController.update);
app.delete('/posts/:id', postController.remove);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' },
    });
  }

  if (error.isPublicAuthError) {
    return res.status(error.statusCode).json({
      error: { code: error.code, message: error.message },
    });
  }

  if (error.statusCode === 422) {
    return res.status(422).json({ error: error.message });
  }

  console.error('Unhandled API error:', error.name);
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
  });
});

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => console.log('API listening'));
}

module.exports = app;
