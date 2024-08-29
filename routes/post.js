const { Router } = require("express");
const {
  createPostHandler,
  deletePostHandler,
  commentPostHandler,
  likeUnlikePostHandler,
  getAllPosts,
  getFollowingPosts,
  getUserPosts,
} = require("../controllers/post.js");
const { verifyToken } = require("../middlewares/verifytoken.js");

const router = Router();

router.post("/create-post", verifyToken, createPostHandler);
router.delete("/delete/:id", verifyToken, deletePostHandler);
router.post("/comment/:id", verifyToken, commentPostHandler);
router.post("/likeunlike/:id", verifyToken, likeUnlikePostHandler);
router.get('/', verifyToken, getAllPosts);
router.get('/following-posts', verifyToken, getFollowingPosts);
router.get('/user', verifyToken, getUserPosts);

module.exports = router;
