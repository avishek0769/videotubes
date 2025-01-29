import { Router } from "express";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";
import { addPost, updateCaption, deletePost, getPostsByUserID, getAllPosts } from "../controllers/communityPost.controller.js"
import { upload } from "../middlewares/multer.middleware.js";


const postRouter = Router()

postRouter.route("/add").post(verifyStrictJWT, upload.single("photo"), addPost)
postRouter.route("/update-delete/:postID")
.patch(verifyStrictJWT, updateCaption)
.delete(verifyStrictJWT, deletePost)
postRouter.route("/get-posts/:userID").get(getPostsByUserID)
postRouter.route("/").get(getAllPosts)

export { postRouter }