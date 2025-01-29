import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloud } from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import fs from "fs";
import { deleteFromCloud } from "../utils/DestroyFile.js"
import mongoose from "mongoose"

const AccessOptions = {
    httpOnly: true,
    // secure: true,
    maxAge: 86400000
    
}
const RefreshOptions = {
    httpOnly: true,
    // secure: true,
    maxAge: (86400000 * 7)
}
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError(500, "Some thing went wrong while generating Access & Refresh tokens")
    }
}

// get users data from frontend
// check validations - not empty,...
// check if account already exists - (username, email)
// check for images, (avatar)
// upload them on cloudinary 
// Again check avatar in cloudinary - url
// create user object - create entry in db
// remove password & refresh token feild
// check for user creation - User.findOne()
// return response (ApiResponse)

const userRegister = asyncHandler(async (req, res)=>{
    const {fullName, username, email, password} = req.body;

    if([fullName, username, email, password].some(feild => feild?.trim() === "")){
        throw new ApiError(400, "All feilds are required")
    }
    console.log(fullName, " ", username," ", email," ", password);
    let avatarLocalPath = req.files.avatar?.[0]?.path;
    let coverImageLocalPath;
    if(!avatarLocalPath) throw new ApiError(409, "Avatar is required !")

    if(req.files && req.files.coverImage && req.files.coverImage[0]){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    const avatarResponse = await uploadOnCloud(avatarLocalPath, "images");
    let coverImageResponse;
    if(coverImageLocalPath){
        coverImageResponse = await uploadOnCloud(coverImageLocalPath, "images");
    }
    if(!avatarResponse) throw new ApiError(500, "Something went wrong while uploading to cloud :(")
    
    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        password,
        email,
        avatar: avatarResponse.url,
        coverImage: coverImageResponse?.url || undefined
    })
    let createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser) throw new ApiError(500, "Something went wrong while registering")

    return res.status(200).json(new ApiResponse(201, createdUser, "User Registered Successfully !!"))
})

const userLogIn = asyncHandler(async (req, res)=>{
    // User data -> req.body
    // verify username or email
    // verify password
    // generate access & refresh token 
    // send Cookies

    const {email, username, password} = req.body;
    if(!(username || email)){
        throw new ApiError(404, "Username or email is required")
    }
    
    const user = await User.findOne({
        $or: [{ username }, {email}]
    })
    if(!user){
        throw new ApiError(404, "Username or email does not exist")
    }
    
    if(!password) throw new ApiError(404, "Password is required")
    
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) throw new ApiError(401, "Password is incorrect !");
        
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findByIdAndUpdate(
        user._id,
        { refreshToken },
        { new: true }
    ).select("-password -refreshToken");

    res
    .status(201)
    .cookie("accessToken", accessToken, AccessOptions)
    .cookie("refreshToken", refreshToken, RefreshOptions)
    .json(new ApiResponse(
        201,
        {
            user: loggedInUser,
            accessToken: accessToken,
            refreshToken: refreshToken
        },
        "User Logged in successfully !!"
    ))
})

const userLogOut = asyncHandler(async (req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: { refreshToken: "" } },
        { new: true }
    )
    res
    .status(200)
    .clearCookie("accessToken", AccessOptions)
    .clearCookie("refreshToken", RefreshOptions)
    .json(new ApiResponse(200, {}, "User Loogged out Successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res)=>{
    try {
        const incomingToken = req.cookies?.refreshToken || req.headers("Authorization").replace("Bearer ", "");
        if(!incomingToken) throw new ApiError(401, "No Refresh Token found");
        
        const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id).select("-password -avatar -coverImage")
        if(!user) throw new ApiError(401, "Unauthorised access");
        
        if(user.refreshToken != incomingToken) throw new ApiError(401, "Unauthorised access -> Refresh token did not match")
        
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
        res
        .status(200)
        .cookie("accessToken", accessToken, AccessOptions)
        .json(new ApiResponse(200, {user, accessToken, refreshToken: newRefreshToken}, "Access Token refreshed !"))
    }
    catch (error) {
        if(error instanceof ApiError) throw error;
        else throw new ApiError(500, "Problem in Refresh Access Token Controller")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res)=>{
    const {oldPassword, newPassword, otp, email} = req.body;
    console.log(oldPassword, newPassword, otp, email);
    let user = await User.findById(req.user._id)
    if(otp){
        const response = await fetch(`http://localhost:8000/api/v1/verify-OTP`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ recipient: email, otp })
        })
        if (response.status > 399) throw new ApiError(411, "Wrong OTP")
    }
    else if(oldPassword){
        let isPwdCorrect = await user.isPasswordCorrect(oldPassword)
        if(!isPwdCorrect){
            throw new ApiError(406, "Password is incorrect")
        }
    } 
    else throw new ApiError(401, "Old password or OTP anyone is required")
    
    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    res.status(200).json(new ApiResponse(200, user, "Password updated successfully"))
})

const getCurrentUser = asyncHandler(async (req, res)=>{
    res.status(200).json(new ApiResponse(200, req.user, "Fetched current user"))
})

const getUserId = asyncHandler(async (req, res)=>{
    const { username } = req.params;
    const user = await User.findOne({username})
    return res.status(200).json(new ApiResponse(200, { userID: user._id }, "User ID fetched successfully"))
})

const updateUserDetails = asyncHandler(async (req, res)=>{
    const {fullName, email, description, username} = req.body;
    
    let obj = {}
    if(fullName) obj.fullName = fullName;
    if(email) obj.email = email;
    if(description) obj.description = description;
    if(username) obj.username = username;
    
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: obj },
        {new: true}
    ).select("-password")

    res.status(200).json(new ApiResponse(200, user, "User detailes modified"))
})

const changeAvatar = asyncHandler(async (req, res)=>{
    const avatarLocalPath = req.file.path;
    if(!avatarLocalPath) throw new ApiError(401, "Avatar file is missing")
    
    await deleteFromCloud(req.user.avatar, "image")
    const avatar = await uploadOnCloud(avatarLocalPath, "images");

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {avatar: avatar.url}
        },
        {new: true}
    )

    res.status(200).json(new ApiResponse(200, user, "Avatar Updated Successfully"))
})

const changeCoverImage = asyncHandler(async (req, res)=>{
    const coverImageLocalPath = req.file.path;
    if(!coverImageLocalPath) throw new ApiError(401, "Cover image file is missing")
    
    if(req.user.coverImage) await deleteFromCloud(req.user.coverImage, "image");
    const coverImage = await uploadOnCloud(coverImageLocalPath, "images");

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {coverImage: coverImage.url}
        },
        {new: true}
    )

    res.status(200).json(new ApiResponse(200, user, "Cover Image Updated Successfully"))
})

const getUserChannelProfile = asyncHandler(async (req, res)=>{
    const { channelID } = req.params;
    if(!channelID) throw new ApiError(401, "channelID does not exists")
    
    const channel = await User.aggregate([
        {
            $match: {_id: new mongoose.Types.ObjectId(channelID)}
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
                email: 1,
                coverImage: 1,
                description: 1,
                subscriberCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, channel[0], "Channel detailes fetched successfully"))
})

const getWatchHistory = asyncHandler(async (req, res)=>{
    const user = await User.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(req.user._id) }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $project: {
                            thumbnail: 1,
                            title: 1,
                            duration: 1,
                            owner: 1,
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
                                        fullName: 1,
                                        avatar: 1,
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
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, user[0].watchHistory, "Watch history fetched successfullly"))
})

const usernameExists = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password -refreshToken -avatar -coverImage");
    if(user) throw new ApiError(401, "Username already exists");
    else res.status(200).json(new ApiResponse(200, null, "Username does not exists"))
})

const removeVideoFromHistory = asyncHandler(async (req, res) => {
    const { videoID } = req.params;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { watchHistory: videoID } },
        { new: true }
    )
    res.status(200).json(new ApiResponse(200, user, "Video removed from watch history"))
})

export { 
    userRegister,
    userLogIn,
    userLogOut,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserDetails,
    changeAvatar,
    changeCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    getUserId,
    usernameExists,
    removeVideoFromHistory
}