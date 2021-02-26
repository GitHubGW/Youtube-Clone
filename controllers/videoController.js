// Global Controller
export const home = (req,res) => res.send("Home page");
export const search = (req,res) => res.send("Search page");

// Video Controller
export const video = (req,res) => res.send("Video page");
export const upload = (req,res) => res.send("Upload page");
export const videoDetail = (req,res) => res.send("VideoDetail page");
export const editVideo = (req,res) => res.send("EditVideo page");
export const deleteVideo = (req,res) => res.send("DeleteVideo page");