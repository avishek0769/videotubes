import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloud } from "../utils/Cloudinary.js"
import { deleteFile, deleteFolder, deleteFromCloud } from "../utils/DestroyFile.js"
import { User } from "../models/user.model.js"
import mongoose from "mongoose"
import { Like } from "../models/likes.model.js"
import { Comment } from "../models/comment.model.js"
import { View } from "../models/views.model.js"
import { Playlist } from "../models/playlist.model.js"
import nlp from "compromise";
import AWS from "aws-sdk"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
const ecs = new AWS.ECS({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_2,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_2,
    region: process.env.AWS_REGION
});

const waitForTaskCompletion = async (taskArn) => {
    let taskStatus = 'PENDING';
    let result;
    while (taskStatus !== 'STOPPED') {
        result = await ecs.describeTasks({
            cluster: process.env.ECS_CLUSTER_NAME,
            tasks: [taskArn]
        }).promise();

        taskStatus = result.tasks[0].lastStatus;
        if (taskStatus !== 'STOPPED') {
            await new Promise(resolve => setTimeout(resolve, 5000)); // wait for 5 seconds before checking again
        }
    }
};

const putObjectURL = asyncHandler(async (req, res) => {
    const { filename } = req.query;
    const command = new PutObjectCommand({
        Bucket: "yt-clone.input.video",
        Key: `${filename}`,
        ContentType: "video/mp4"
    })
    const url = await getSignedUrl(s3Client, command);
    res.status(200).json(new ApiResponse(200, { url }, "Signed URL generated !"))
})

const thumbnailSignedURL = asyncHandler(async (req, res) => {
    const { filename, contentType } = req.query;
    const command = new PutObjectCommand({
        Bucket: "thumbnail.bucket",
        Key: `${filename}`,
        ContentType: `image/${contentType}`
    })
    const url = await getSignedUrl(s3Client, command);
    res.status(200).json(new ApiResponse(200, { url }, "Signed URL generated !"))
})

const pollForStatus = asyncHandler(async (req, res) => {
    const { videoID } = req.params;
    const video = await Video.findById(videoID);
    res.status(200).json(new ApiResponse(200, {isPublished: video.isPublished}, "Video Status fetched"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    try {
        const { title, description, tags, thumbnailURL } = req.body;
        const { objectKey, duration } = req.query;
    
        if ([title, thumbnailURL, tags].some(field => !field)) {
            throw new ApiError(401, "All feilds are required except description !")
        }
        const tagsArr = tags.split(" ").map(tag => tag.toLowerCase());
        if (tagsArr.length < 2) throw new ApiError(401, "Atleast three tags are required");
        
        console.log(thumbnailURL, duration, objectKey);
        const folderName = uuidv4()

        const params = {
            taskDefinition: process.env.ECS_TASK_DEFINITION,
            launchType: 'FARGATE',
            cluster: process.env.ECS_CLUSTER_NAME,
            count: 1,
            platformVersion: 'LATEST',
            overrides: {
                containerOverrides: [
                    {
                        name: process.env.ECS_CONTAINER_NAME,
                        environment: [
                            { name: 'S3_KEY', value: objectKey },
                            { name: 'FOLDER_NAME', value: folderName }
                        ]
                    }
                ]
            },
            networkConfiguration: {
                awsvpcConfiguration: {
                    subnets: [
                        "subnet-0a4c4c37f473cff99",
                        "subnet-077e0bc3bddecfc00"
                    ],
                    assignPublicIp: 'ENABLED'
                }
            }
        };
    
        const runTaskResponse = await ecs.runTask(params).promise().catch(error => {
            console.log("ECS Error --------> ", error);
        });
        console.log('ECS task triggered successfully');
        const taskArn = runTaskResponse.tasks[0].taskArn;
    
        const videoDocument = await Video.create({
            title,
            description: description ? description : "",
            thumbnail: thumbnailURL,
            videoFile: `https://s3.amazonaws.com/yt-clone.output.video/${folderName}`,
            duration: duration || 0,
            owner: req.user._id,
            tags: tagsArr,
            isPublished: false
        })
        res.status(200).json(new ApiResponse(200, videoDocument, "Video uploaded successfully !"));

        await waitForTaskCompletion(taskArn);
        console.log('Video Processed successfully');
        videoDocument.isPublished = true;
        await videoDocument.save();
    }
    catch (error) {
        res.status(505).json(new ApiResponse(505, {error: error.message}, "Failed to upload !"));
    }
})

const getVideoByID = asyncHandler(async (req, res) => {
    const { videoID } = req.params;
    if (!videoID) throw new ApiError(401, "videoID name is wrong");

    const video = await Video.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(videoID) }
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
    if (!video) throw new ApiError(500, "Video is not present with this id");

    let user;
    if (req.user) {
        user = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { watchHistory: videoID } },
            { new: true }
        )
    }
    if (!user && req.user) throw new ApiError(500, "User's Watch History is not updated")
    res.status(200).json(new ApiResponse(200, video[0], "Video fetched Successfully"));
})

const getAllVideos = asyncHandler(async (req, res) => {
    const { pageNo, limit, sortBy } = req.query;
    const videos = await Video.aggregate([
        {
            $skip: (Number(pageNo) - 1) * Number(limit)
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
    res.status(200).json(new ApiResponse(200, videos, "Videos fetched Successfully !"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const thumbnailLocalPath = req.file?.path;
    let thumbnailURL;

    if (!thumbnailLocalPath && !title && !description) throw new ApiError(401, "Anyone feild is required");

    if (thumbnailLocalPath) {
        thumbnailURL = await uploadOnCloud(thumbnailLocalPath, "images");
    }

    const video = await Video.findOne({ _id: req.params.videoID })

    video.title = title ? title : video.title;
    video.description = description ? description : video.description;
    video.thumbnail = thumbnailURL?.url || video.thumbnail;
    await video.save({ validateBeforeSave: false })

    const updatedVideo = await Video.findById(video._id);
    res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated Successfully"));
})

const deleteVideo = asyncHandler(async (req, res) => {
    try {
        const { videoID } = req.params;
        if (!videoID) throw new ApiError(500, "Channel ID is wrong or does not exists");
    
        let video = await Video.findOne({ _id: videoID })
        if (!video) throw new ApiError(500, "Video not Found");
    
        await deleteFolder(`${video.videoFile.split("/").slice(-1)}/`);
        await deleteFile(video.thumbnail)
        await Like.deleteMany({ video: videoID });
        await Comment.deleteMany({ video: videoID });
        await View.deleteMany({ video: videoID });
        await Playlist.updateMany(
            { videos: videoID },
            { $pull: { videos: videoID } }
        );
        video = await Video.deleteOne({ _id: videoID });
        res.status(200).json(new ApiResponse(200, video, "Video Deleted !!"))
    } catch (error) {
        throw new ApiError(401, "Error in deleting the VIDEO, Controller")
    }
})

const getUserVideos = asyncHandler(async (req, res) => {
    const { channelID } = req.params;
    const videos = await Video.find({ owner: channelID }).select("-owner -description -videoFile -isPublished -updatedAt")

    if (!videos) throw new ApiError(500, "Can't Fetch videos")
    res.status(200).json(new ApiResponse(200, videos, "Videos Fetched Successfully !"))
})

const searchVideo = asyncHandler(async (req, res) => {
    const { searchInput } = req.body;

    const doc = nlp(searchInput);
    let adjectives = doc.adjectives().out('array');
    let nouns = doc.nouns().out('array');
    let words = [...adjectives, ...nouns]
    let joinedWords = words.join(" ")
    let splitWords = joinedWords.split(" ")
    let wordsArr = splitWords.filter(word => !(word.includes("video") || word.includes("photo")))
        .map(word => word.trim().toLowerCase())

    wordsArr.sort((a, b) => b.length - a.length);
    let processedWords = new Set();
    wordsArr.forEach(string => {
        if (![...processedWords].some(s => s.includes(string))) {
            processedWords.add(string);
        }
    });
    let finalArray = Array.from(processedWords); // Convert set back to array and return

    const regExPattern = finalArray.map(word => new RegExp(word, "i"));
    const query = finalArray.join(" ")

    const videos = await Video.aggregate([
        {
            $match: {
                $text: { $search: query }
            }
        },
        {
            $addFields: {
                score: { $meta: "textScore" }
            }
        },
        {
            $match: {
                $or: [
                    { title: { $in: regExPattern } },
                    { description: { $in: regExPattern } },
                    { tags: { $in: regExPattern } }
                ]
            }
        },
        {
            $sort: {
                score: { $meta: "textScore" }
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
                            username: 1,
                            avatar: 1
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
        },
        {
            $project: {
                thumbnail: 1,
                title: 1,
                description: 1,
                tags: 1,
                duration: 1,
                owner: 1,
                createdAt: 1
            }
        }

    ])
    res.status(200).json(new ApiResponse(200, videos, "Videos fetched Successfully according to User's Search"))
})
export {
    getAllVideos,
    publishAVideo,
    getVideoByID,
    updateVideo,
    deleteVideo,
    getUserVideos,
    searchVideo,
    putObjectURL,
    thumbnailSignedURL,
    pollForStatus
}