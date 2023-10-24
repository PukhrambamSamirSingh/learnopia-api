const mongoose = require("mongoose")

const { Schema } = mongoose

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    profession: {
        type: String,
        required: [true, "Profession is required"]
    },
    profilePic: {
        type: String
    },
    followers: [
        { type: Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    followings: [
        { type: Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model("User", UserSchema)
