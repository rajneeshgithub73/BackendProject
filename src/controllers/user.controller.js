import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
    //extract the user credentials from the request body
    //validate the user credentials
    //check if the user is already registered: username, email
    //check for images, check for avatar
    //upload them to the cloudinary server
    //create user object -> create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response

    const { fullname, email, username, password } = req.body

    if(fullname === "") {
        throw new ApiError(400, "fullname is required")
    }

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "all fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new ApiError(409, "user already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "Somthing went wrong while creating user.")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user created successfully!")
    )

})

// const loginUser = asyncHandler( async (req, res) => {
//     //fetch the user details from req body
//     //validate the user details
//     //check if the user already exists
//     //if the user already exists verify the email and password
//     //send cookies to the user

// })

export { registerUser }