import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
    likedBy: {
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
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
})

export const Like = mongoose.model("Like", LikeSchema)