const express = require("express");
const controller = require("../controllers/postController");

const router = express.Router();

router.get("/posts", controller.listPosts);
router.get("/posts/:id", controller.getPost);
router.post("/posts", controller.createPost);
router.post("/posts/:id/likes", controller.likePost);

// Safe demo route: returns a generic 500 error
router.get("/test-error", controller.explode);

module.exports = router;