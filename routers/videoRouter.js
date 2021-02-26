import express from "express";
import routes from "../routes";

const videoRouter = express.Router();

videoRouter.get(routes.videos, (req, res) => res.send("Video page"));
videoRouter.get(routes.upload, (req, res) => res.send("Upload page"));
videoRouter.get(routes.videoDetail, (req, res) => res.send("VideoDetail page"));
videoRouter.get(routes.editVideo, (req, res) => res.send("EditVideo page"));
videoRouter.get(routes.deleteVideo, (req, res) => res.send("DeleteVideo page"));

export default videoRouter;