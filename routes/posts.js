const express = require("express");
const postsController = require("./../controllers/posts");
const auth = require("./../middlewares/auth");
const router = express.Router();

router.post("/", auth, postsController.createPost);

router.get("/", auth,postsController.getPosts);

router.get("/:id", auth,postsController.getPost);

router.put("/:id", auth,postsController.updatePost);

router.delete("/:id", auth,postsController.deletePost);

module.exports = router;
