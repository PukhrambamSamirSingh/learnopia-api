const Post = require("../models/Post")
const User = require("../models/User")
const bcrypt = require("bcryptjs")

const getUser = async (req, res) => {
    try {
        let user;
        if (req.params.username) {
            user = await User.findOne({ username: req.params.username });
        } else if (req.params.userId) {
            user = await User.findOne({ _id: req.params.userId });
        } else {
            return res.status(400).json({ error: "Username or userId parameter is required" });
        }

        if (!user) {
            return res.status(404).send("User not found");
        }

        const { password, ...other } = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const getUserQuery = async (req, res) => {
    const username = req.query.username;

    try {
        // Create a case-insensitive regular expression for the username
        const regex = new RegExp(username, "i");
        const user = await User.findOne({ username: regex });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { password, ...other } = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};




const updateUserPassword = async (req, res) => {
    try {
        const { password } = req.body
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(401).send("You can update only your password")
        }
        const salt = await bcrypt.genSalt(10)
        const hashPwd = await bcrypt.hash(password, salt)

        user.password = hashPwd
        await user.save()
        res.status(200).json({ message: "Password updated successfully" })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

const updateUser = async (req, res) => {
    try {
        const { profilePic, username, desc, profession } = req.body
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(401).send("You can update only your info")
        }
        if (profilePic) {
            user.profilePic = profilePic
        }
        if (username) {
            user.username = username
        }
        if (desc) {
            user.desc = desc;
        }
        if (profession) {
            user.profession = profession
        }
        await user.save()
        res.status(200).json({ message: "Updated successfully" })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

const followUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    const currentUser = await User.findById(req.userId)

    if (user._id.toString() !== currentUser._id.toString()) {
        try {
            if (!user.followers.includes(currentUser._id.toString())) {
                await user.updateOne({ $push: { followers: currentUser._id.toString() } })
                await currentUser.updateOne({ $push: { followings: req.params.id } })
                res.status(200).send("User has been followed successfully")
            } else {
                res.status(200).send("You already followed this user")
            }
        } catch (error) {
            res.status(500).json({ error: error })
        }
    } else {
        res.status(403).send("You cannot follow yourself")
    }
}
const unfollowUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    const currentUser = await User.findById(req.userId)

    if (user._id.toString() !== currentUser._id.toString()) {
        try {
            if (user.followers.includes(currentUser._id.toString())) {
                await user.updateOne({ $pull: { followers: currentUser._id.toString() } })
                await currentUser.updateOne({ $pull: { followings: req.params.id } })
                res.status(200).send("User has been unfollowed successfully")
            } else {
                res.status(200).send("You already unfollowed this user")
            }
        } catch (error) {
            res.status(500).json({ error: error })
        }
    } else {
        res.status(403).send("You cannot unfollow yourself")
    }
}

const getFollowings = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("followings", "-password");

        const followingUsers = user.followings.map((u) => {
            const { password, ...other } = u._doc;
            return other;
        });

        res.status(200).json(followingUsers);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("followers", "-password")

        const followedUsers = user.followers.map((u) => {
            const { password, ...other } = u._doc
            return other
        })

        res.status(200).json(followedUsers)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = {
    getUser,
    updateUserPassword,
    updateUser,
    followUser,
    unfollowUser,
    getFollowings,
    getFollowers,
    getUserQuery
}