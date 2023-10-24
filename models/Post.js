const mongoose = require("mongoose")

const { Schema } = mongoose

const PostSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
        default: []
    }
}, { timestamps: true })

module.exports = mongoose.model("Post", PostSchema)