import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Like } from "../models/likes.model.js"
import mongoose from "mongoose"

const toggleLike = asyncHandler(async (req, res) => {
    const { somethingID } = req.params;
    if(!somethingID) throw new ApiError(401, "Something's ID is not present");
    const { content } = req.query;

    let like;
    let liker;
    let likeDocument = { likedBy: req.user._id }
    
    if(content == "video"){
        liker = await Like.findOne({ likedBy: req.user._id, video: somethingID })
        likeDocument.video = somethingID;
    }
    else if(content == "comment"){
        liker = await Like.findOne({ likedBy: req.user._id, comment: somethingID })
        likeDocument.comment = somethingID;
    }
    else if(content == "post"){
        liker = await Like.findOne({ likedBy: req.user._id, communityPost: somethingID })
        likeDocument.communityPost = somethingID
    }
    else{
        throw new ApiError(500, "Content is not mentioned in Query (toggleLike)")
    }
    
    if(!liker){
        like = await Like.create(likeDocument)
        return res.status(200).json(new ApiResponse(200, like, "Like added successfully"))
    }
    else{
        like = await Like.deleteOne({ _id: liker._id })
        return res.status(200).json(new ApiResponse(200, like, "Like removed successfully"))
    }
})

const getLikes = asyncHandler(async (req, res) => {
    const { somethingID } = req.params;
    if(!somethingID) throw new ApiError(401, "Something's ID is not present");
    const { content } = req.query;

    let noOfLikes;
    let user;
    if(content == "video"){
        noOfLikes = await Like.find({ video: somethingID })
    }
    else if(content == "comment") {
        noOfLikes = await Like.find({ comment: somethingID })
    }
    else if(content == "post"){
        noOfLikes = await Like.find({ communityPost: somethingID })
    } 
    else throw new ApiError(401, "Content is not mentioned in Query (getLikes)")

    res.status(200).json(new ApiResponse(200, noOfLikes.length, "No of Likes fetched successfully"))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id),
                communityPost: undefined,
                comment: undefined,
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $project: {
                            thumbnail: 1,
                            owner: 1,
                            title: 1,
                            createdAt: 1,
                            duration: 1,
                            description: 1,
                            createdAt: 1
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        avatar: 1,
                                        fullName: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            },
        },
        {
            $addFields: {
                video: {
                    $first: "$video"
                }
            }
        }
        
    ])
    res.status(200).json(new ApiResponse(200, likedVideos, "Liked Videos fetched Successfully"))
})

const likedByUser = asyncHandler(async (req, res) => {
    const { somethingID } = req.params;
    const { content } = req.query;
    let user;
    if(content == "video") user = await Like.findOne({ likedBy: req.user._id, video: somethingID });
    else if(content == "comment") user = await Like.findOne({ likedBy: req.user._id, comment: somethingID });
    else if(content == "post") user = await Like.findOne({ likedBy: req.user._id, communityPost: somethingID });
    else throw new ApiError(401, "Content is not defined");

    if(!user) res.status(200).json(new ApiResponse(200, { liked: false }, "User never liked the video"))
    else res.status(200).json(new ApiResponse(200, { liked: true }, "User have liked the video"))
})

export {
    toggleLike,
    getLikedVideos,
    getLikes,
    likedByUser
}