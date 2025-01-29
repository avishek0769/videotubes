import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, isPrivate } = req.body;
    const playlist = await Playlist.create({
        name,
        description: "No description",
        owner: req.user._id,
        isPrivate: Boolean(isPrivate)
    })
    res.status(200).json(new ApiResponse(200, playlist, "Playlist created Successfully"))
})

const toggleVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistID, videoID } = req.params;
    if (!isValidObjectId(playlistID) || !isValidObjectId(videoID)) {
        throw new ApiError(500, "PlaylistID or videoID is not a valid ObjectID")
    }
    const playlist = await Playlist.findById(playlistID);

    let operation;
    if (playlist.videos.includes(videoID)) {
        operation = { $pull: { videos: videoID } }
    }
    else {
        operation = { $addToSet: { videos: videoID } }
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistID,
        operation,
        { new: true }
    )
    res.status(200).json(new ApiResponse(200, updatedPlaylist, "Video toggled to selected playlist"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userID } = req.params;
    let query = {
        owner: userID,
        isPrivate: false
    }

    let userPlaylists;
    if(!req.user){
        userPlaylists = await Playlist.find(query)
    }
    else if(req.user._id != userID){
        userPlaylists = await Playlist.find(query)
    }
    else{
        userPlaylists = await Playlist.find({ owner: userID })
    }
    res.status(200).json(new ApiResponse(200, userPlaylists, "User's Playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlist_ID } = req.params;
    const playlist = await Playlist.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(playlist_ID) }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            owner: 1,
                            createdAt: 1,
                            duration: 1
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
                                        fullName: 1,
                                        avatar: 1
                                    }
                                },                                
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
                            fullName: 1,
                            avatar: 1
                        }
                    },                                
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
    res.status(200).json(new ApiResponse(200, playlist[0], "Playlist fetched successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlist_ID } = req.params;
    if (!playlist_ID) {
        throw new ApiError(500, "PlaylistID is not a present")
    }
    const playlist = await Playlist.deleteOne({ _id: playlist_ID })
    res.status(200).json(new ApiResponse(200, playlist, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { name, description, isPrivate } = req.body;
    const { playlist_ID } = req.params;

    const updateData = { isPrivate: isPrivate }
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    const playlist = await Playlist.findByIdAndUpdate(
        playlist_ID,
        { $set: updateData },
        { new: true }
    )
    res.status(200).json(new ApiResponse(200, playlist, "Playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    toggleVideoToPlaylist,
    deletePlaylist,
    updatePlaylist
}