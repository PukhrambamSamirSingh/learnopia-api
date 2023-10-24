const Post = require("../models/Post")
const Review = require("../models/Review")

const createReview = async (req, res) => {
    const { postId } = req.body
    const post = await Post.findOne({ _id: postId })

    if (post && post.userId.toString() === req.userId) {
        return res.status(401).send("You cannot review your post")
    }
    const newReview = new Review({
        postId,
        userId: req.userId,
        description: req.body.description
    })
    try {
        const reviewExists = await Review.findOne({
            postId: req.body.postId,
            userId: req.userId
        })
        if (reviewExists) {
            return res.status(400).send("You have already review this post")
        }
        const saveReview = await newReview.save()
        res.status(200).json(saveReview)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ postId: req.params.postId.toString() }).sort({ createdAt: -1 }).populate("userId", "-password")
        res.status(200).json(reviews)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

module.exports = {
    createReview,
    getReviews
}