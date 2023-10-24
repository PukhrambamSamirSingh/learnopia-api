const express = require("express")
const { getUser, updateUserPassword, updateUser, followUser, unfollowUser, getFollowings, getFollowers, getUserQuery } = require("../controllers/user")
const verifyToken = require("../middleware/verifyToken")
const router = express.Router()

router.get("/getuser/:param", async (req, res) => {
    const { param } = req.params;
    const isObjectId = param.match(/^[0-9a-fA-F]{24}$/); // Check if the param is a valid MongoDB ObjectId
    if (isObjectId) {
        // If it's a valid ObjectId, search by userId
        req.params.userId = param;
    } else {
        // Otherwise, search by username
        req.params.username = param;
    }
    // Call the getUser function passing the modified req and res objects
    getUser(req, res);
});
router.put("/update", verifyToken, updateUserPassword)
router.put("/updateuser", verifyToken, updateUser)
router.put("/follow/:id", verifyToken, followUser)
router.put("/unfollow/:id", verifyToken, unfollowUser)
router.get("/followingusers/:id", getFollowings)
router.get("/followers/:id", getFollowers)
router.get("/getuser/", getUserQuery)


module.exports = router