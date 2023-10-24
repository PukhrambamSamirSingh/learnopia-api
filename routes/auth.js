const express = require("express")
const { createUser, loginUser, logoutUser, getCurrentUser } = require("../controllers/auth")
const verifyToken = require("../middleware/verifyToken")
const router = express.Router()

router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/getuser", verifyToken, getCurrentUser)
router.post("/logout", logoutUser)

module.exports = router