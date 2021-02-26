import express from "express";
import { video, upload, videoDetail, editVideo, deleteVideo } from "../controllers/videoController";
import routes from "../routes";

const videoRouter = express.Router();

videoRouter.get(routes.videos, video);
videoRouter.get(routes.upload, upload);
videoRouter.get(routes.videoDetail, videoDetail);
videoRouter.get(routes.editVideo, editVideo);
videoRouter.get(routes.deleteVideo, deleteVideo);

export default videoRouter;