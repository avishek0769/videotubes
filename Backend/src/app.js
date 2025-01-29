import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ message });
}
// Some important configurations for every requests
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
// app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json())

// Routes
import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users", userRouter)

import { subscriptionRouter } from "./routes/subscription.routes.js"
app.use("/api/v1/subscription", subscriptionRouter)

import { videoRouter } from "./routes/video.routes.js"
app.use("/api/v1/videos", videoRouter)

import { commentRouter } from "./routes/comment.routes.js"
app.use("/api/v1/comments", commentRouter)

import { playlistRouter } from "./routes/playlist.routes.js"
app.use("/api/v1/playlist", playlistRouter)

import { viewsRouter } from "./routes/views.routes.js"
app.use("/api/v1/views", viewsRouter)

import { likesRouter } from "./routes/likes.routes.js"
app.use("/api/v1/likes", likesRouter)

import { postRouter } from "./routes/communityPost.routes.js"
app.use("/api/v1/community-post", postRouter)

import { sendOTP_ResetPass, sendOTP_CreateAcc, verifyOTP } from "./utils/Send_&_Verify_OTP.js";
app.post("/api/v1/register/send-OTP", sendOTP_CreateAcc);
app.post("/api/v1/reset-password/send-OTP", sendOTP_ResetPass);
app.post("/api/v1/verify-OTP", verifyOTP);

// Routes to serve the HTML Files 
app.get("/:slug", (req, res)=>{
    res.sendFile(`${req.params.slug}.html`, {root: "public/HTML_files"})
})

app.use(errorHandler)

export {app}
