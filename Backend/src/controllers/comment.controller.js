import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Comment } from "../models/comment.model.js"
import mongoose from "mongoose"
// import {ObjectId} from "bson"

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { somethingID } = req.params;
    const { content_type } = req.query;
    if(!somethingID) throw new ApiError(500, "Something ID is not present in params");

    let commentObj = {
        content,
        commenter: req.user._id
    }
    if(content_type == "video") commentObj.video = somethingID;
    else if(content_type == "post") commentObj.communityPost = somethingID;
    else throw new ApiError(407, "Content_type is not mentioned in Query (addComment)")

    const comment = await Comment.create(commentObj)
    res.status(200).json(new ApiResponse(200, comment, "Comment added successfully !"))
})

const addReply = asyncHandler(async (req, res) => {
    const { commentID } = req.params;
    const { content } = req.body;
    if(!commentID) throw new ApiError(407, "Comment ID is not present in params");
    
    const replyComment = await Comment.create({ content, commenter: req.user._id })
    const comment = await Comment.findByIdAndUpdate(
        commentID,
        { $push: { reply: replyComment._id } },
        { new: true }
    )

    if(comment.video) replyComment.video = comment.video;
    else if(comment.communityPost) replyComment.communityPost = comment.communityPost;

    replyComment.reply = undefined;
    const reply = await replyComment.save()
    res.status(200).json(new ApiResponse(200, reply, "Reply added to the comment"))
})

const getComments = asyncHandler(async (req, res) => {
    const { somethingID } = req.params;
    const { content, pageNo, limit } = req.query;
    if(!somethingID) throw new ApiError(400, "Something ID is not present in params");

    let comments;
    if(content == "video"){
        comments = await Comment.aggregate([
            { $match: { video: new mongoose.Types.ObjectId(somethingID) } },
            { $skip: (Number(pageNo)-1) * Number(limit) },
            { $limit: Number(limit) },
            {
                $lookup: {
                    from: "users",
                    localField: "commenter",
                    foreignField: "_id",
                    as: "commenter",
                    pipeline: [
                        {
                            $project: {
                                avatar: 1,
                                fullName: 1,
                                username: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    content: 1,
                    commenter: 1,
                    reply: 1,
                    createdAt: 1
                }
            },
            {
                $addFields: {
                    commenter: {
                        $first: "$commenter"
                    }
                }
            }
        ])
    }
    else if(content == "post"){
        comments = await Comment.aggregate([
            { $match: { communityPost: new mongoose.Types.ObjectId(somethingID) } },
            { $skip: (Number(pageNo)-1) * Number(limit) },
            { $limit: Number(limit) },
            {
                $lookup: {
                    from: "users",
                    localField: "commenter",
                    foreignField: "_id",
                    as: "commenter",
                    pipeline: [
                        {
                            $project: {
                                avatar: 1,
                                fullName: 1,
                                username: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    content: 1,
                    commenter: 1,
                    reply: 1,
                    createdAt: 1,
                    communityPost: 1
                }
            },
            {
                $addFields: {
                    commenter: {
                        $first: "$commenter"
                    }
                }
            }
        ])
    }
    else{
        throw new ApiError(400, "content is not present in Query (getComments)");
    }

    res.status(200).json(new ApiResponse(200, comments, "Comments fetched Successfully"));
})

const getReply = asyncHandler(async (req, res) => {
    const { commentID } = req.params;
    const replies = await Comment.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(commentID) }
        },
        {
            $lookup: {
                from: "comments",
                localField: "reply",
                foreignField: "_id",
                as: "reply",
                pipeline: [
                    {
                        $project: {
                            content: 1,
                            commenter: 1
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "commenter",
                            foreignField: "_id",
                            as: "commenter",
                            pipeline: [
                                {
                                    $project: {
                                        avatar: 1,
                                        fullName: 1,
                                        username: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            commenter: {
                                $first: "$commenter"
                            }
                        }
                    }
                ]
            }
        }
    ])
    res.status(200).json(new ApiResponse(200, replies[0].reply, "Replies fetched successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentID } = req.params;
    if(!commentID) throw new ApiError(500, "Comment ID not present");
    
    const comment = await Comment.findOne({ _id: commentID })
    if(!comment) throw new ApiError(500, "Comment not found");
    
    comment.content = req.body.content;
    await comment.save();
    res.status(200).json(new ApiResponse(200, { content: req.body.content }, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentID } = req.params;
    if(!commentID) throw new ApiError(500, "Comment ID not present");
    
    const comment = await Comment.findById(commentID);
    if(comment.reply.length > 0){
        for (const id of comment.reply) {
            await Comment.deleteOne({ _id: id });
        }
    }
    const commentDel = await Comment.deleteOne({ _id: commentID })
    if(!comment) throw new ApiError(500, "Comment not Deleted");
    res.status(200).json(new ApiResponse(200, commentDel, "Comment deleted Successfully !"))
})

const deleteReply = asyncHandler(async (req, res) => {
    const { replyID, commentID } = req.params;
    if(!replyID || !commentID) throw new ApiError(401, "Send ALL params carefully");

    const reply = await Comment.deleteOne({ _id: replyID });
    const comment = await Comment.findByIdAndUpdate(
        commentID,
        { $pull: { reply: replyID } },
        { new: true }
    )
    res.status(200).json(new ApiResponse(200, reply, "Reply deleted successfully"))
})

const noOfComments = asyncHandler(async (req, res) => {
    const { somethingID } = req.params;
    const { content } = req.query;
    let commentObj = {};

    if(content == "video") commentObj.video = somethingID;
    else if(content == "post") commentObj.communityPost = somethingID;
    else throw new ApiError(407, "Content is not mentioned in Query (addComment)")

    const number = await Comment.find(commentObj)
    res.status(200).json(new ApiResponse(200, number.length, "Number of comments fetched"))
})

export {
    addComment,
    addReply,
    getComments,
    getReply,
    deleteComment,
    deleteReply,
    updateComment,
    noOfComments
}