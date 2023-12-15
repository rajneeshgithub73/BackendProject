// require('dotenv').config({path: './env'})
import dotenv from "dotenv"


import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server listening on ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !! ", err);
})














/*
First way to connect to the database:
const app = express();
;( async () => {
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (err) => {
            console.log("ERROR", err)
            throw err
        })

        app.listen(process.env.PORT || 8000, () => {
        console.log(`Server listening on ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("Error", error);
        throw error;
    }
})()
*/
