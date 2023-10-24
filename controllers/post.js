const Post = require("../models/Post")
const Review = require("../models/Review")
const User = require("../models/User")

const createPost = async (req, res) => {
    try {
        const newPost = await Post({
            userId: req.userId.toString(),
            ...req.body
        })
        const savePost = await newPost.save()
        res.status(200).json(savePost)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

const getPost = async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.id }).populate("userId", "-password -email")
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate("userId", "-password -email")
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

const getPostsByUsername = async (req, res) => {
    const searchQuery = req.query.search;

    try {
        // Create a case-insensitive regular expression for the username
        const regex = new RegExp(searchQuery, "i");
        const user = await User.findOne({ username: regex });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const posts = await Post.find({ userId: user._id }).populate("userId", "-password -email").sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

const updatePost = async (req, res) => {
    const { title, content } = req.body
    try {
        const post = await Post.findById(req.params.id)
        const user = await User.findById(req.userId)

        if (post.userId.toString() !== user._id.toString()) {
            return res.status(401).send("You can only update your post")
        }
        if (title) {
            post.title = title
        }
        if (content) {
            post.content = content
        }
        await post.save()
        res.status(200).json({ message: "Post updated successfully" })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const user = await User.findById(req.userId)

        if (!post) {
            return res.status(401).send("Post not found")
        }
        if (post.userId.toString() !== user._id.toString()) {
            return res.status(401).send("You can delete only your post")
        }
        //Deleting reviews to the post
        await Review.deleteMany({ postId: post._id })

        await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const user = await User.findById(req.userId)
        if (!post.likes.includes(user._id.toString())) {
            await post.updateOne({ $push: { likes: user._id.toString() } })
            res.status(200).json({ message: "Post has been liked" })
        } else {
            await post.updateOne({ $pull: { likes: user._id.toString() } })
            res.status(200).json({ message: "Post has been disliked" })
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}
const timelinePosts = async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId).populate("followings");
        const followingUsers = currentUser.followings.map((u) => {
            const { _id, ...other } = u._doc;
            return _id;
        });
        // Include the currentUser's id in the followingUsers array
        followingUsers.push(currentUser._id);

        const posts = await Post.find({ userId: { $in: followingUsers } })
            .sort({ createdAt: -1 })
            .populate("userId", "-password -email")
            .select("-__v");

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = {
    createPost,
    getPost,
    getPosts,
    likePost,
    updatePost,
    deletePost,
    timelinePosts,
    getPostsByUsername
}