const express = require("express")
const verifyToken = require("../middleware/verifyToken")
const { createReview, getReviews } = require("../controllers/review")
const router = express.Router()

router.post("/createreview", verifyToken, createReview)
router.get("/getreviews/:postId", getReviews)

module.exports = router