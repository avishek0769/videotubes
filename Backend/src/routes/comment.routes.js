import { Router } from "express";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";
import { addComment, addReply, getComments, getReply, updateComment, deleteComment, deleteReply, noOfComments } from "../controllers/comment.controller.js"
import { ApiError } from "../utils/ApiError.js";

const commentRouter = Router()

commentRouter.route("/add-get/:somethingID")
.get(getComments)
.post(verifyStrictJWT, addComment)

commentRouter.route("/add-get-reply/:commentID")
.get(getReply)
.post(verifyStrictJWT, addReply)

commentRouter.route("/delete-reply/:commentID/:replyID").delete(verifyStrictJWT, deleteReply)

commentRouter.route("/update-delete/:commentID")
.delete(verifyStrictJWT, deleteComment)
.patch(verifyStrictJWT, updateComment)

commentRouter.route("/count/:somethingID").get(noOfComments)



export { commentRouter }