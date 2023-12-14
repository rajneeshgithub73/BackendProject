// require('dotenv').config({path: './env'})
import dotenv from "dotenv"


import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})


connectDB()














/*
First way to connect to the database:

;( async () => {
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (err) => {
            console.log("ERROR", err)
            throw err
        })
    } catch (error) {
        console.error("Error", error);
        throw error;
    }
})()
*/
