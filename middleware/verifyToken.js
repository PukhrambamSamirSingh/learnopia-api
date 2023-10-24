const jwt = require("jsonwebtoken")
const verifyToken = async (req, res, next) => {
    const token = req.cookies.accessToken
    if (!token) {
        return res.status(400).send("You are not authenticated")
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) return res.status(400).send("Token is not valid")

        req.userId = data.id
        next()
    })
}

module.exports = verifyToken