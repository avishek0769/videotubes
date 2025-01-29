import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    commenter: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    communityPost: {
        type: Schema.Types.ObjectId,
        ref: "CommunityPost"
    },
    reply: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"    
    }]
}, {timestamps: true})


export const Comment = mongoose.model("Comment", commentSchema)