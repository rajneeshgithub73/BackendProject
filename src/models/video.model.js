import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String,  //cloudinary url
            required: true,
        },
        thumbnail: {
            tyep: String, //cloudinary url
            required: true,
        },
        title: {
            tyep: String,
            required: true,
        },
        description: {
            tyep: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublised: {
            type: Boolean,
            default: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        
    },
    {
        timestamps: true
    }
);

export const Video = mongoose.model("Video", videoSchema);