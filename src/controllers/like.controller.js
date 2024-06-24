import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if(!isValidObjectId(videoId)){
        throw new ApiError(401, "invalid video id")
    }

    const isLiked = await Like.findOne({
        $or: [{video: videoId}, {likedBy: req.user?._id}]
    })

    if(isLiked.length > 0){
        await Like.findByIdAndDelete(isLiked._id)
    }else{
        await Like.create({
            video: videoId,
            likedBy: req.user?._id
        })
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "video like is updated"
    ))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if(!isValidObjectId(commentId)){
        throw new ApiError(401, "invalid comment id")
    }

    const isLiked = await Like.findOne({
        $or: [{comment: commentId}, {likedBy: req.user?._id}]
    })

    if(isLiked.length > 0){
        await Like.findByIdAndDelete(isLiked._id)
    }else{
        await Like.create({
            comment: commentId,
            likedBy: req.user?._id
        })
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "comment like is updated"
    ))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if(!isValidObjectId(tweetId)){
        throw new ApiError(401, "invalid tweet id")
    }

    const isLiked = await Like.findOne({
        $or: [{tweet: tweetId}, {likedBy: req.user?._id}]
    })

    if(isLiked.length > 0){
        await Like.findByIdAndDelete(isLiked._id)
    }else{
        await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id
        })
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "tweet like is updated"
    ))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = await Like.find({
        likedBy: req.user?._id
    })

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        likedVideos,
        "All liked videos fetched successfully!!!"
    ))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}