import { Router } from "express";
import { toggleSubscription, getChannelSubscribers, getChannelsSubscribedTo, getNoOfSubscribers } from "../controllers/subscription.controller.js";
import { verifyStrictJWT } from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router()

subscriptionRouter.route("/toggle/:channelID").post(verifyStrictJWT, toggleSubscription)
subscriptionRouter.route("/get-subs/:channelID").get(verifyStrictJWT, getChannelSubscribers)
subscriptionRouter.route("/get-channels/:channelID").get(verifyStrictJWT, getChannelsSubscribedTo)
subscriptionRouter.route("/get-no-of-subs/:channelID").get(getNoOfSubscribers)

export { subscriptionRouter }