const express = require('express');
const controller = require('../controllers/postController');

const router = express.Router();

router.get('/Posts', controller.listPosts);
router.get('/Post/:id', controller.getPost);
router.post('/Post', controller.createPost);
router.post('/Post/:id', controller.likePost);



module.exports = router;