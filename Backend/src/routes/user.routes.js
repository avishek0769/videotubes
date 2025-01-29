import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyStrictJWT , verifyJWT } from "../middlewares/auth.middleware.js";
import { userLogIn,
        userLogOut,
        userRegister,
        refreshAccessToken,
        changeCurrentPassword,
        getCurrentUser,
        updateUserDetails,
        changeAvatar,
        changeCoverImage,
        getUserChannelProfile,
        getWatchHistory,
        getUserId,
        usernameExists,
        removeVideoFromHistory
    } from "../controllers/user.controller.js";
const userRouter = Router()

userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar", // Name of the feild in the form of HTML or Postman
            maxCount: 1
        },
        {
            name: "coverImage", // Name of the feild in the form of HTML or Postman
            maxCount: 1
        }
    ]),
    userRegister
)
userRouter.route("/login").post(userLogIn)

// SECURED ROUTES
userRouter.route("/logout").get(verifyStrictJWT, userLogOut)
userRouter.route("/refresh-accessToken").patch(refreshAccessToken)
userRouter.route("/change-password").patch(verifyStrictJWT, changeCurrentPassword)
userRouter.route("/get-user").get(verifyStrictJWT, getCurrentUser)
// userRouter.route("/get-userID/:username").get(verifyStrictJWT, getUserId) // This was wriiten for my ease in adding Subs-doc, but now think i don't need this route.
userRouter.route("/update-user-detailes").patch(verifyStrictJWT, updateUserDetails)
userRouter.route("/change-avatar").patch(upload.single("avatar"), verifyStrictJWT, changeAvatar)
userRouter.route("/change-coverImage").patch(upload.single("coverImage"), verifyStrictJWT, changeCoverImage)
userRouter.route("/:channelID").get(verifyJWT, getUserChannelProfile) // this is to get all the info of channel after clicking in the channel 
userRouter.route("/v/get-watch-history").get(verifyStrictJWT, getWatchHistory)
userRouter.route("/watch-history/remove/:videoID").get(verifyStrictJWT, removeVideoFromHistory)
userRouter.route("/username/:username").get(usernameExists)
/* 
When i will show all the videos in the home page then the owner's a/c will also be shown with the videos poster
I can easily get all the videos by a route and the owners with the owner id will be joined with video doc.
So i can put the owner_id in the data-attribute of the HTML card for owner-section.
*/

export default userRouter;