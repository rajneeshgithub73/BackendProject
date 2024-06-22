import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, username } = req.query
    //TODO: get all videos based on query, sort, pagination
    console.log(req.query)

    const channel = await User.findOne({ username: username})

    console.log("channel: ", channel)

    if(!channel){
        throw new ApiError(404, "channel not found")
    }

    const channelVideos = await Video.find({
        owner: channel._id
    })

    console.log("channelVideos: ", channelVideos)

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        channelVideos,
        "videos fetched successfully"
    ))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if(!title || !description){
        throw new ApiError(400, "title and description are required")
    }
    // TODO: get video, upload to cloudinary, create video

    const videoLocalFilePath = req.files?.videoFile[0]?.path

    if(!videoLocalFilePath){
        throw new ApiError(400, "video file is required");
    }

    const thumbnailLocalFilePath = req.files?.thumbnail[0]?.path

    if(!thumbnailLocalFilePath){
        throw new ApiError(400, "video thumbnail is required");
    }

    const uploadedVideoResponse = await uploadOnCloudinary(videoLocalFilePath)
    const uploadedThumbnailResponse = await uploadOnCloudinary(thumbnailLocalFilePath)

    console.log(uploadedVideoResponse)
    console.log(uploadedThumbnailResponse)

    if(!uploadedVideoResponse || !uploadedThumbnailResponse){
        throw new ApiError(400, "video and thumbnail files are required")
    }

    const video = await Video.create({
        videoFile: uploadedVideoResponse.url,
        thumbnail: uploadedThumbnailResponse.url,
        title: title,
        description: description,
        duration: uploadedVideoResponse.duration,
        owner: req.user?._id
    })

    console.log(video)

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "video is uploaded successfully!"
    ))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!videoId) {
        throw new ApiError(401, "video id is required")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "video does not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        video,
        "video file found"
    ))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}