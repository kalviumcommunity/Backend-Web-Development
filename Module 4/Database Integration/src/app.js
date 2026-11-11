
const express = require('express');
const postController = require('./controllers/postController');

const app = express();

app.use(express.json());

app.get('/posts', postController.list);
app.get('/posts/:id', postController.get);
app.post('/posts', postController.create);
app.patch('/posts/:id', postController.update);
app.delete('/posts/:id', postController.remove);

// General application error handling
app.use((error, req, res, next) => {
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      error: error.message
    });
  }

  console.error(error);

  return res.status(500).json({
    error: 'Internal server error'
  });
});

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log('API listening');
  });
}

module.exports = app;
