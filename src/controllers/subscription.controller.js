import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    const subscriberId = req.user?._id

    try {
        //first chech if user is subscribed to this channel
    
        const isSubscribed = await Subscription.findOne({
            subscriber: subscriberId,
            channel: channelId
        })
    
        if(isSubscribed) {
    
        //if isSubscribed is true find and delete documet where subscriber is user and channer has channelId
    
            await Subscription.findOneAndDelete({
                subscriber: subscriberId,
                channel: channelId
            })
    
        }else{
    
        //if isSubscribed is false then add subscription to channel
        
            await Subscription.create({
                subscriber: subscriberId,
                channel: channelId
            })
        }
    
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                {},
                "channel subscription updated successfully"
        ))
    } catch (error) {
        throw new ApiError(400, error.message || "something went wrong while updating subscription")
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    console.log(req.params)

    const {channelId} = req.params

    const isValid = isValidObjectId(channelId)

    console.log(isValid)

    console.log("channelId: ", channelId)

    try {
        const channerSubscribersList = await Subscription.find({
            channel: channelId
        })
    
        console.log(channerSubscribersList)
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            channerSubscribersList,
            "subscribers List fetched successfully"
        ))
    } catch (error) {
        throw new ApiError(400, error.message)
    }
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {

    const {channelId} = req.params

    const isValid = isValidObjectId(channelId)

    console.log(isValid)

    console.log("channelId: ", channelId)

    try {
        const SubscribedchannelList = await Subscription.find({
            subscriber: channelId
        })
    
        console.log(SubscribedchannelList)
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            SubscribedchannelList,
            "subscribed channel List fetched successfully"
        ))
    } catch (error) {
        throw new ApiError(400, error.message)
    }
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}