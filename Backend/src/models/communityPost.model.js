import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    caption: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    photo: {
        type: String
    }
}, {timestamps: true})

export const Community_Post = mongoose.model("Community_Post", postSchema)