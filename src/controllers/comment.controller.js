import mongoose, {isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }

    //find all the documents in comment database where video is videoId
    //return these documents

    const videoComments = await Comment.find({
        video: videoId
    })

    console.log("video comments: ", videoComments)

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        videoComments,
        "Comments for video fetched successfully"
    ))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }

    const {content} = req.body

    if(!content){
        throw new ApiError(400, "Invalid content")
    }

    await Comment.create({
        content: content,
        video: videoId,
        owner: req.user?._id
    })

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Comment for video added successfully"
    ))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id")
    }

    const { content } = req.body

    const reqCommentDoc = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: content
            }
        },
        {
            new: true
        }
    )

    console.log(reqCommentDoc)

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "comment editing successfull!!!"
    ))

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const { commentId } = req.params

    await Comment.findByIdAndDelete(commentId)

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "comment deleted successfull!!!"
    ))
    
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}