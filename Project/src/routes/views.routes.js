import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addView, getViews } from "../controllers/views.controller.js";

const viewsRouter = Router()

viewsRouter.route("/:videoID")
.post(verifyJWT, addView)
.get(getViews)

export { viewsRouter };