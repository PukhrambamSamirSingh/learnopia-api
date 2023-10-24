const express = require("express")
const verifyToken = require("../middleware/verifyToken")
const { createPost, getPosts, getPost, updatePost, deletePost, timelinePosts, likePost, getPostsByUsername } = require("../controllers/post")

const router = express.Router()

router.post("/createpost", verifyToken, createPost)
router.get("/getpost/:id", getPost)
router.get("/getallposts", getPosts)
router.put("/update/:id", verifyToken, updatePost)
router.delete("/delete/:id", verifyToken, deletePost)
router.get("/timelineposts", verifyToken, timelinePosts)
router.put("/like/:id", verifyToken, likePost)
router.get("/posts", getPostsByUsername)

module.exports = router