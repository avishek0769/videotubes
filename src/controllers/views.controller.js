import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { View } from "../models/views.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose"

const addView = asyncHandler(async (req, res) => {
    const { videoID } = req.params;
    const userID = req.user?._id;
    if(!userID) return res.status(200).json(new ApiResponse(200, "View not added, viewer is logged out or not registered"))

    if(!videoID) throw new ApiError(500, "Video ID is wrong or not present")
    const viewer = await View.findOne({ viewer: userID, video: videoID })

    let view;
    if(!viewer){
        view = await View.create({
            viewer: req.user._id,
            video: videoID
        })
        res.status(200).json(new ApiResponse(200, view, "View added successfully"))
    }
    res.status(204).json(new ApiResponse(204, view, "View Not added !, User is repeatedly watching the same video"))
})

const getViews = asyncHandler(async (req, res) => {
    const { videoID } = req.params;
    if(!videoID) throw new ApiError("Video ID is not present")
    
    const views = await View.find({ video: new mongoose.Types.ObjectId(videoID) })
    res.status(200).json(new ApiResponse(200, { views: views.length }, "Views fetched successfully"))
})

export { addView, getViews }