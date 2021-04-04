// 모든 라우트의 URL 경로를 지정해주고 관리하는 파일

// Global Route
const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";

// Users Route
const USERS = "/users";
const USER_DETAIL = "/:id"; // express에서는 url에 콜론(:)을 넣어주면 해당 부분에 변하는 값이 들어간다는 것을 앎(id에는 어떠한 값도 들어갈 수 있음) ex)/users/1, /users/2 etc..
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";
const ME = "/me";

// Videos Route
const VIDEOS = "/videos";
const UPLOAD = "/upload";
const VIDEOS_DETAIL = "/:id";
const EDIT_VIDEO = "/:id/edit";
const DELETE_VIDEO = "/:id/delete";

// GitHub Route
const GITHUB = "/auth/github";
const GITHUB_CALLBACK = "/auth/github/callback";

// Facebook Route
const FACEBOOK = "/auth/facebook";
const FACEBOOK_CALLBACK = "/auth/facebook/callback";

// Routes Object(라우터들을 모아놓은 객체)
const routes = {
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  search: SEARCH,
  users: USERS,
  userDetail: (id) => {
    if (id) {
      return `/users/${id}`;
    } else {
      return USER_DETAIL;
    }
  },
  editProfile: EDIT_PROFILE,
  changePassword: CHANGE_PASSWORD,
  me: ME,
  videos: VIDEOS,
  upload: UPLOAD,
  videoDetail: (id) => {
    if (id) {
      // 주의!! 만약 /videos/${id}에서 맨 앞에 /를 쓰지 않으면 주소가 /videos/videos/6062a777b18f4b66b8598967 이런식으로 찍히게 되서 정상적인 videoDetail 경로가 나오지 않게 된다.
      // 그래서 videos앞에 꼭 /를 붙여야 /videos/6062a777b18f4b66b8598967 이렇게 정상적으로 경로가 설정되게 된다. (아마도 앞에 /를 붙이지 않으면 기존 /videos 라우터를 유지한채 뒤에 경로가 추가되는 것 같다.)
      return `/videos/${id}`;
    } else {
      return VIDEOS_DETAIL;
    }
  },
  editVideo: (id) => {
    if (id) {
      return `/videos/${id}/edit`;
    } else {
      return EDIT_VIDEO;
    }
  },
  deleteVideo: (id) => {
    if (id) {
      return `/videos/${id}/delete`;
    } else {
      return DELETE_VIDEO;
    }
  },
  github: GITHUB,
  githubCallback: GITHUB_CALLBACK,
  facebook: FACEBOOK,
  facebookCallback: FACEBOOK_CALLBACK,
};

export default routes;
