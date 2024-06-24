import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const { content } = req.body

    const isTweet = await Tweet.create({
        content: content,
        owner: req.user?._id
    })

    console.log(isTweet)

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Tweet created successfully"
    ))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(401, "invalid userId")
    }

    const userTweets = await Tweet.find({
        owner: userId,
    })

    console.log(userTweets)

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        userTweets,
        "Tweet fetched successfully"
    ))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(401, "Invalid tweet id")
    }

    const {content} = req.body

    if(!content){
        throw new ApiError(401, "content is required")
    }

    const newTweetDoc = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: content
            }
        },
        {
            new: true
        }
    )

    console.log(newTweetDoc)

    return res
    .status(200)
    .json(new ApiError(
        200,
        {},
        "Tweet updated successfully"
    ))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(401, "Invalid tweet id")
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(200)
    .json(new ApiError(
        200,
        {},
        "Tweet deleted successfully"
    ))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}