// Global Controller
// res.render()함수는 설정된 views폴더에서 자동으로 템플릿 파일을 찾아서 랜더링한다.
// 즉 views폴더에 있는 home.pug파일을 찾아서 랜더링 시킴
export const home = (req,res) => res.render("home"); // home.pug대신 그냥 home으로도 가능
export const search = (req,res) => res.render("search");

// Video Controller
export const video = (req,res) => res.render("video");
export const upload = (req,res) => res.render("upload");
export const videoDetail = (req,res) => res.render("videoDetail");
export const editVideo = (req,res) => res.render("editVideo");
export const deleteVideo = (req,res) => res.render("deleteVideo");