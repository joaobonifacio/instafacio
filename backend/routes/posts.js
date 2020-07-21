const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const PostsController = require('../controllers/posts');
const extractFile = require('../middleware/file');

console.log("No backend, antes das decalarações de routing");


router.post("",
checkAuth,
extractFile,
PostsController.createPost);

router.put("/:id",
checkAuth,
extractFile,
PostsController.updatePost);

router.get("",
PostsController.getPosts);

router.get("/:id",
PostsController.getPost);

router.delete("/:id",
checkAuth,
PostsController.deletePost);

module.exports = router;
