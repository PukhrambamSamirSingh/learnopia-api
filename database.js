const mongoose = require("mongoose")

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to mongoDB successfully")
    } catch (err) {
        console.log("Database connection failed", err)
    }
}

module.exports = connect