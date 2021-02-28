import { videos } from "../db";

// Global Controller
// res.render()함수는 설정된 views폴더에서 자동으로 템플릿 파일을 찾아서 랜더링한다.
// 즉 views폴더에 있는 home.pug파일을 찾아서 랜더링 시킴
// res.render()함수는 첫 번째 인자로는 템플릿을 두 번째 인자로는 앞에 템플릿에 추가할 정보가 담긴 객체를 넘겨줌
export const home = (req, res) => {
  res.render("home", { pageTitle: "Home", videos: videos }); // home.pug대신 그냥 home으로도 가능
};
export const search = (req, res) => {
  // req.query에는 사용자가 입력한 form에 대한 정보가 들어있다.
  // const searchingBy = req.query.term;
  // 위의 req.query.term을 새로운 ES6 방식으로 구현함
  const {
    query: { term: searchingBy },
  } = req;
  res.render("search", { pageTitle: "Search", searchingBy: searchingBy });
};
// Video Controller
export const video = (req, res) => res.render("video", { pageTitle: "Video" });
export const upload = (req, res) => res.render("upload", { pageTitle: "Upload" });
export const videoDetail = (req, res) => res.render("videoDetail", { pageTitle: "videoDetail" });
export const editVideo = (req, res) => res.render("editVideo", { pageTitle: "editVideo" });
export const deleteVideo = (req, res) => res.render("deleteVideo", { pageTitle: "deleteVideo" });
