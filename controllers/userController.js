import routes from "../routes";

// Global Controller
export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
export const postJoin = (req, res) => {
  console.log(req.body); // bodyParser가 없으면 req객체안에 있는 값들을 가져오지 못한다. (req.body를 해도 undefined가 뜸)
  // const {body} = req는 const body = req.body와 같은 의미이다.
  const {
    body: { name, email, password, verify_password },
  } = req;
  if (password !== verify_password) {
    res.status(400); // 비밀번호와 비밀번호 확인이 다르면 status code 400을 응답함(400은 Bad Request-요청 실패)
    res.render("join", { pageTitle: "Join" });
  } else {
    // 사용자 등록, 로그인
    // 비밀번호와 비밀번호 확인이 같으면 routes.home페이지로 리다이렉트함.
    res.redirect(routes.home);
  }
};

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};
export const postLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  res.redirect(routes.home);
};

// User Controller
export const users = (req, res) => res.render("users", { pageTitle: "Users" });
export const userDetail = (req, res) => res.render("userDetail", { pageTitle: "userDetail" });
export const editProfile = (req, res) => res.render("editProfile", { pageTitle: "editProfile" });
export const changePassword = (req, res) => res.render("changePassword", { pageTitle: "changePassword" });
