// 모든 라우트의 URL 경로를 지정해주고 관리하는 파일

// Global Route
const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";

// Users Route
const USERS = "/users";
const USER_DETAIL = "/:id"  // express에서는 url에 콜론(:)을 넣어주면 해당 부분에 변하는 값이 들어간다는 것을 앎(id에는 어떠한 값도 들어갈 수 있음) ex)/users/1, /users/2 etc..
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";

// Videos Route
const VIDEOS="/videos";
const UPLOAD="/upload";
const VIDEOS_DETAIL="/:id";
const EDIT_VIDEO="/:id/edit"; 
const DELETE_VIDEO="/:id/delete";

// Route Object(라우터들을 모아놓은 객체)
const routes = {
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  search: SEARCH,
  users: USERS,
  userDetail: USER_DETAIL,
  editProfile: EDIT_PROFILE,
  changePassword: CHANGE_PASSWORD,
  videos: VIDEOS,
  upload: UPLOAD,
  videoDetail: VIDEOS_DETAIL,
  editVideo: EDIT_VIDEO,
  deleteVideo: DELETE_VIDEO
}

export default routes;