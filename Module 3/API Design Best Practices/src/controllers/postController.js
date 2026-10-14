const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res) {
const result = service.listPosts(req.query);

return http.sendList(res, result);
}

function getPost(req, res) {
const post = service.getPost(req.params.id);

if (!post) {
return http.sendError(
res,
404,
'NOT_FOUND',
'Post not found'
);
}

return http.sendOk(res, post);
}

function createPost(req, res) {
const { title, author } = req.body || {};

if (
typeof title !== 'string' ||
!title.trim() ||
typeof author !== 'string' ||
!author.trim()
) {
return http.sendError(
res,
400,
'VALIDATION_ERROR',
'Title and author are required'
);
}

const post = service.createPost({
title: title.trim(),
author: author.trim()
});

return http.sendCreated(res, post);
}

function likePost(req, res) {
try {
const post = service.likePost(req.params.id);

```
return http.sendOk(res, {
  id: post.id,
  likes: post.likes
});
```

} catch (err) {
if (err.statusCode === 404) {
return http.sendError(
res,
404,
'NOT_FOUND',
'Post not found'
);
}

```
console.error(err);

return http.sendError(
  res,
  500,
  'INTERNAL_ERROR',
  'Something went wrong'
);
```

}
}

function explode(req, res) {
try {
service.explode();

```
return http.sendOk(res, { ok: true });
```

} catch (err) {
console.error(err);

```
return http.sendError(
  res,
  500,
  'INTERNAL_ERROR',
  'Something went wrong'
);
```

}
}

module.exports = {
listPosts,
getPost,
createPost,
likePost,
explode
};
