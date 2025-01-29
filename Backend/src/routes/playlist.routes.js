import { Router } from "express";
import {
    createPlaylist, getUserPlaylists, getPlaylistById,
    deletePlaylist, updatePlaylist, 
    toggleVideoToPlaylist} from "../controllers/playlist.controller.js";
import { verifyJWT, verifyStrictJWT } from "../middlewares/auth.middleware.js";

const playlistRouter = Router()

playlistRouter.route("/create").post(verifyStrictJWT, createPlaylist)

playlistRouter.route("/:playlistID/:videoID").post(verifyStrictJWT, toggleVideoToPlaylist)

playlistRouter.route("/:userID").get(verifyJWT, getUserPlaylists)

playlistRouter.route("/p/:playlist_ID")
.get(verifyStrictJWT, getPlaylistById)
.patch(verifyStrictJWT, updatePlaylist)
.delete(verifyStrictJWT, deletePlaylist)

export { playlistRouter }