import express from "express";
import { getUpload, postUpload, videoDetail, getEditVideo, postEditVideo, deleteVideo, video } from "../controllers/videoController";
import { uploadVideo, onlyPrivate } from "../middlewares";
import routes from "../routes";

const videoRouter = express.Router();

videoRouter.get(routes.upload, onlyPrivate, getUpload);
videoRouter.post(routes.upload, onlyPrivate, uploadVideo, postUpload);

videoRouter.get(routes.editVideo(), onlyPrivate, getEditVideo);
videoRouter.post(routes.editVideo(), onlyPrivate, postEditVideo);

videoRouter.get(routes.deleteVideo(), onlyPrivate, deleteVideo);

videoRouter.get(routes.videoDetail(), videoDetail);

export default videoRouter;
