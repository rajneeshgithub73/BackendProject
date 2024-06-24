import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    try {
        const playlist = await Playlist.create({
            name: name,
            description: description,
            owner: req.user?._id
        })

        console.log(playlist)
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "playlist created successfully"
        ))
    } catch (error) {
        throw new ApiError(400, "Error while creating playlist")
    }
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    try {
        const userPlaylists = await Playlist.find({
            owner: userId
        })
    
        console.log("userPlaylist: ", userPlaylists)
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            userPlaylists,
            "User playlist fetched successfully"
        ))
    } catch (error) {
        throw new ApiError(400, "Error while getting user playlists")
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    try {
        const playlist = await Playlist.findById(playlistId)

        console.log("playlist: ", playlist)
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            playlist,
            "playlist fetched successfully!!!"
        ))
    } catch (error) {
        throw new ApiError(400, "Error while getting playlist")
    }

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: add video to playlist

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist id")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "invalid video id")
    }

    //get the plalist document using playlist id
    //add video to video array
    //replace the old video array with new video array 

    try {

        console.log("i am here")

        const playlist = await Playlist.findById(playlistId)

        console.log("i am here2")
    
        const newVideoArray = playlist.videos.push(videoId)

        console.log("newVideoArray", newVideoArray)
    
        const newPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $set: {
                    videos: playlist.videos
                }
            },
            {
                new: true
            }
        )
    
        console.log(newPlaylist);
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "video added to playlist successfully!!!"
        ))
    
    } catch (error) {
        throw new ApiError(400, error.message || "Something went wrong while adding video to playlist")
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist id")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "invalid video id")
    }

    //get the plalist document using playlist id
    //remove video from video array
    //replace the old video array with new video array 

    try {
        const playlist = await Playlist.findById(playlistId)

        console.log("Playlist", playlist)
    
        const newVideoArray = playlist.videos.filter((vId)=>{
            return vId!=videoId
        })

        console.log("newVideoArray", newVideoArray)
    
        const newPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $set: {
                    videos: newVideoArray
                }
            },
            {
                new: true
            }
        )
    
        console.log("newPlaylist", newPlaylist)
    
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                {},
                "video deleted from playlist successfully!!!"
        ))
    } catch (error) {
        throw new ApiError(400, error.message || "somthing went wrong while deleting video from playlist")
    }
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    try {
        await Playlist.findByIdAndDelete(playlistId)
        
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "playlist deleted successfully"
        ))
    } catch (error) {
        throw new ApiError(400, error.message || "error while deleting playlist")
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name: name,
                description: description
            }
        },
        {
            new: true
        }
    )

    console.log(updatedPlaylist)

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "playlist details updated successfully!!!"
    ))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
