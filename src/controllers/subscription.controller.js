import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelID } = req.params;
    if(!channelID) throw new ApiError(500, "Channel ID not present");

    const subscriber = await Subscription.findOne({ subscriber: req.user._id, channel: channelID })
    let subs;
    if(!subscriber){
        subs = await Subscription.create({
            subscriber: req.user._id,
            channel: channelID
        })
        return res.status(200).json(new ApiResponse(200, subs, `${req.user.fullName} Subscribed the channel`));
    }
    else{
        subs = await Subscription.deleteOne({
            subscriber: req.user._id,
            channel: channelID
        })
        return res.status(200).json(new ApiResponse(200, subs, `${req.user.fullName} Unsubscribed the channel`));
    }
})

const getChannelSubscribers = asyncHandler(async (req, res) => {
    const { pageNo, limit } = req.query;
    const { channelID } = req.params;
    if(!channelID) throw new ApiError(500, "Channel ID not present");

    const subscribers = await Subscription.aggregate([
        {
            $match: { channel: new mongoose.Types.ObjectId(channelID) }
        },
        {
            $skip: (Number(pageNo)-1)*Number(limit)
        },
        {
            $limit: Number(limit)
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
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
            $project: {
                subscriber: 1
            }
        },
        {
            $addFields: {
                subscriber: {
                    $first: "$subscriber"
                }
            }
        }
    ])
    res.status(200).json(new ApiResponse(200, subscribers, "Subscribers of the channel fetched Successfully"))
})

const getChannelsSubscribedTo = asyncHandler(async (req, res) => {
    const channelID = req.params.channelID
    const channel = await Subscription.aggregate([
        {
            $match: { subscriber: new mongoose.Types.ObjectId(channelID) }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
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
                channel: {
                    $first: "$channel"
                }
            }
        },
        {
            $project: {
                channel: 1
            }
        }
    ])
    res.status(200).json(new ApiResponse(200, channel, "Channels subscribed to fetched Successfully"))
})

const getNoOfSubscribers = asyncHandler(async (req, res) => {
    const { channelID } = req.params;
    const number = await Subscription.find({ channel: channelID })
    res.status(200).json(new ApiResponse(200, number.length, "Number of Subscribers fetched"))
})

export { toggleSubscription, getChannelSubscribers, getChannelsSubscribedTo, getNoOfSubscribers}