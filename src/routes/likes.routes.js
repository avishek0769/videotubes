import { Router } from "express";
import { verifyJWT, verifyStrictJWT } from "../middlewares/auth.middleware.js";
import { toggleLike, getLikedVideos, getLikes, likedByUser } from "../controllers/likes.controller.js"
// Cautiously change the routes, because you know how u have written the controllers
const likesRouter = Router()

likesRouter.route("/toggle-like/:somethingID").post(verifyStrictJWT, toggleLike)
likesRouter.route("/get-likes/:somethingID").get(verifyJWT, getLikes)
likesRouter.route("/get-liked-videos").get(verifyStrictJWT, getLikedVideos)
likesRouter.route("/liked-or-not/:somethingID").get(verifyStrictJWT, likedByUser)

export { likesRouter }