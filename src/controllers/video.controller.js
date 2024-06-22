import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { response } from "express"
import {v2 as cloudinary} from "cloudinary"

cloudinary.config({ 
    cloud_name: process.env.COUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


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

    const { title, description } = req.body

    if(!videoId || !title || !description){
        throw new ApiError(400, "Invalid video input")
    }

    // try {
        let video = await Video.findById(videoId)
    
        if(!video){
            throw new ApiError(400, "video not found")
        }
    
        // console.log(req)
    
        const newThumbnailFilePath = req.file?.path

        console.log(newThumbnailFilePath)
    
        if(!newThumbnailFilePath){
            throw new ApiError(404, "newThumbnailFilePath is required")
        }
    
        console.log("i am here")

        const oldThumbnailPublicId = video.thumbnail.split("/").pop().split(".")[0];

        const isOldThumbnailDestroyed = await cloudinary.uploader.destroy(oldThumbnailPublicId)
    
        console.log("isOldThumbnailDestroyed: ", isOldThumbnailDestroyed)
    
        if(isOldThumbnailDestroyed.result!=='ok'){
            throw new ApiError(400, "Error while updating thumbnail")
        }
    
        const newThumbnailUploadResponse = await uploadOnCloudinary(newThumbnailFilePath)
    
        console.log(newThumbnailUploadResponse)

        if(!newThumbnailUploadResponse){
            throw new ApiError(400, "Error while uploading new thumbnail")
        }
    
        video = await Video.findByIdAndUpdate(
            videoId,
            {
                $set:{
                    thumbnail: newThumbnailUploadResponse.url,
                    title: title,
                    description: description,
                }
            },
            {
                new: true
            }
        )

        console.log(video)
    
        if(!video){
            throw new ApiError(404, "something went wrong")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "video Details updated successfully"
        ))
    // } catch (error) {
    //     throw new ApiError(401, "Something1 went wrong")
    // }
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const video = await Video.findById(videoId)

    console.log(video)

    if(!video){
        throw new ApiError(404, "video not found")
    }

    const isVideoDeleted = await cloudinary.uploader.destroy(video.videoFile.split("/").pop().split(".")[0], {
        resource_type: "video"
    })

    const isThumbnailDeleted = await cloudinary.uploader.destroy(video.thumbnail.split("/").pop().split(".")[0], {
        resource_type: "image"
    })

    console.log("video public id: ", video.videoFile.split("/").pop().split(".")[0])

    console.log("isThumbnailDeleted", isThumbnailDeleted)
    console.log("isVideoDeleted", isVideoDeleted)

    if(isThumbnailDeleted.result!=='ok' || isVideoDeleted.result!=='ok'){
        throw new ApiError(400, "Error while deleting video files")
    }

    const isDeleted = await Video.findByIdAndDelete(videoId)

    if(!isDeleted){
        throw new ApiError(400, "Error while deleting video")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Video deleted"
    ))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    const isValid = isValidObjectId(videoId);

    console.log(isValid)

    if(!isValid){
        throw new ApiError(400, "invalid video id")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublised: !video.isPublised
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "video publishing status updated"
    ))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}