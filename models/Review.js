const mongoose = require("mongoose")

const { Schema } = mongoose

const ReviewSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Review", ReviewSchema)