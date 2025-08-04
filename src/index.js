// require("dotenv").config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/connect.js"
import { app } from "./app.js"

dotenv.config({
    path: './.env'
})

// Running the server after connecting DB
connectDB()
.then(()=>{
    app.on("error", (error)=>{
        console.log("Server issue: ", error);
    })

    app.listen(process.env.PORT, ()=>{
        console.log("Server running at: ", process.env.PORT);
    })
})
.catch((error)=>{
    console.log("MONGODB connection Failed: ", error);
})