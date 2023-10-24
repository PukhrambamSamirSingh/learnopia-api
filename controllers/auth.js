const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const createUser = async (req, res) => {
    const usernameExists = await User.findOne({ username: req.body.username })
    if (usernameExists) {
        return res.status(401).send("User already exists")
    }
    const salt = await bcrypt.genSalt(10)
    const hashPwd = await bcrypt.hash(req.body.password, salt)
    try {
        const newUser = await User({
            ...req.body,
            password: hashPwd
        })
        const saveUser = await newUser.save()
        res.status(200).send(saveUser)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const usernameExists = await User.findOne({ username })
        if (!usernameExists) {
            return res.status(401).send("Enter valid credentials")
        }
        const comparePassword = await bcrypt.compare(password, usernameExists?.password)
        if (!comparePassword) {
            return res.status(401).send("Enter valid credentials")
        }
        const { password: userPasword, ...other } = usernameExists._doc
        const data = {
            id: usernameExists._id
        }
        const token = jwt.sign(data, process.env.JWT_SECRET)
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }).status(200).json(other)

    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

const getCurrentUser = async (req, res) => {
    try {
        const userId = await User.findById(req.userId)

        const { password, ...other } = userId._doc
        res.status(200).json(other)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}


const logoutUser = (req, res) => {
    res.clearCookie("accessToken", { secure: true, sameSite: 'none' });
    res.status(200).json({ message: "Logout successful" });
};

module.exports = {
    createUser,
    loginUser,
    getCurrentUser,
    logoutUser
}