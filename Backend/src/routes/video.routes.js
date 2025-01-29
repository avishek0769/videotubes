import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyStrictJWT , verifyJWT } from "../middlewares/auth.middleware.js";
import { publishAVideo, getAllVideos, getVideoByID, getUserVideos, updateVideo, deleteVideo, searchVideo, putObjectURL, thumbnailSignedURL, pollForStatus } from "../controllers/video.controller.js";

const videoRouter = Router()

videoRouter.route("/publish").post(verifyStrictJWT, publishAVideo);
videoRouter.route("/").get(getAllVideos)
videoRouter.route("/g-p-d/:videoID")
.get(verifyJWT, getVideoByID)
.patch(verifyStrictJWT, upload.single("thumbnail"), updateVideo)
.delete(verifyStrictJWT, deleteVideo)

videoRouter.route("/getSignedURL").get(putObjectURL)
videoRouter.route("/getThumbnailSignedURL").get(thumbnailSignedURL)
videoRouter.route("/c/:channelID").get(getUserVideos)
videoRouter.route("/search").post(searchVideo)
videoRouter.route("/poll_status/:videoID").get(pollForStatus)

// videoRouter.route("/cancel-upload/:sessionID").get(cancelUpload)

export { videoRouter }