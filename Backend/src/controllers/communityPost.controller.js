import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Community_Post } from "../models/communityPost.model.js"
import mongoose from "mongoose"
import { uploadOnCloud } from "../utils/Cloudinary.js"
import { User } from "../models/user.model.js"
import { deleteFromCloud } from "../utils/DestroyFile.js"

const addPost = asyncHandler(async (req, res) => {
    const { caption } = req.body;
    const photo = await uploadOnCloud(req.file?.path , "Community_Post");

    const post = await Community_Post.create({
        caption,
        owner: req.user._id,
        photo: photo?.url || undefined 
    })
    res.status(200).json(new ApiResponse(200, post, "Community Post uploaded"))
})

const updateCaption = asyncHandler(async (req, res) => {
    const { postID } = req.params;
    const { caption } = req.body;
    if(!postID) throw new ApiError(401, "Post ID is not present ");

    const post = await Community_Post.findByIdAndUpdate(
        postID,
        { $set: { caption } },
        { new: true }
    )
    res.status(200).json(new ApiResponse(200, post, "Caption of the post updated"));
})

const deletePost = asyncHandler(async (req, res) => {
    const { postID } = req.params;
    if(!postID) throw new ApiError(401, "Post ID is not present");

    const post = await Community_Post.findById(postID);
    if(post.photo){
        const photoDelCloud = await deleteFromCloud(post.photo, "image")
        if(photoDelCloud == "not found") throw new ApiError(401, "Failed to delete photo from Cloud");
    }

    const postDeleted = await Community_Post.deleteOne({ _id: postID });
    res.status(200).json(new ApiResponse(200, postDeleted, "Community Post deleted successfully"))
})

const getPostsByUserID = asyncHandler(async (req, res) => {
    const { userID } = req.params;
    const owner = await User.findById(userID).select("-password -coverImage -email -refreshToken -watchHistory -updatedAt");
    const posts = await Community_Post.find({ owner: userID }).select("-owner -updatedAt");
    res.status(200).json(new ApiResponse(200, {posts, owner}, "User's Community Posts Fetched"))
})

const getAllPosts = asyncHandler(async (req, res) => {
    const { pageNo, limit } = req.query;
    if(!pageNo || !limit) throw new ApiError(401, "Page no and limit are important");

    const posts = await Community_Post.aggregate([
        {
            $skip: Number(pageNo-1)*Number(limit)
        },
        {
            $limit: Number(limit)
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
                            fullName: 1,
                            username: 1
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
    ])
    res.status(200).json(new ApiResponse(200, posts, "All Community Posts Fetched"))
})

export {
    addPost,
    updateCaption,
    deletePost,
    getPostsByUserID,
    getAllPosts
}