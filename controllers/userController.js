import passport from "passport";
import routes from "../routes";
import User from "../models/User";

// Global Controller
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res, next) => {
  console.log(req.body); // bodyParser가 없으면 req객체안에 있는 값들을 가져오지 못한다. (req.body를 해도 undefined가 뜸)
  // const {body} = req는 const body = req.body와 같은 의미이다.
  const {
    body: { name, email, password, verifyPassword },
  } = req;
  if (password !== verifyPassword) {
    res.status(400); // 비밀번호와 비밀번호 확인이 다르면 status code 400을 응답함(400은 Bad Request-요청 실패)
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      // 사용자를 생성한다.-> creat()함수를 이용
      // (하나의 사용자 객체를 생성한다.-> 그냥 User({}))
      // create()함수는 사용자를 생성하고 그 정보를 데이터베이스에 저장까지 한다.
      // 사용자를 생성하고 기다려달라고 await를 썼다. (await를 쓰기 위해서는 위에 async가 필요함)
      // 사용자를 생성할 때 정보는 사용자가 Join페이지에서 회원가입을 해서 req객체에 담겨져 있는 req.body.name과 req.body.email을 사용자를 생성하게 된다.
      // (아래 name, email은 name: name, email: email과 같은 의미이다.)
      const user = await User({
        name,
        email,
      });

      // 위에서 생성한 사용자를 등록한다.-> register()함수를 이용
      // register()함수는 주어진 password를 이용해 새로운 사용자를 등록시킨다.
      // 위에서 생성한 user와 req.body가 가지고 있는 password를 등록한다.
      await User.register(user, password);

      // 회원가입을 하는 동시에 사용자를 로그인 시켜주기 위해 postJoin함수를 미들웨어로 만들었다.
      // postJoin함수가 실행된 후에 next()를 통해 postLogin함수를 실행할 것이다.
      // 미들웨어는 다음 함수에게 정보를 넘겨주는 특징이 있기 때문에 여기서 받은 user와 password정보는 postLogin함수로 전달되게 될 것이고
      // 그 전달받은 정보를 이용해서 postLogin함수가 로그인을 시켜줄 것이다.
      next();

      // 유저를 성공적으로 등록까지 했다면 DB에 등록한 유저에 대한 정보가 남아있을 것이다.
      // 그것을 확인하기 위해서 터미널에서 mongoDB를 실행시킨 후 아래와 같은 과정을 이용해 데이터베이스를 확인해보자.
      // mongo(몽고DB 접속)-> show dbs(DB 리스트 확인)-> use youtube(DB 사용)-> show collections(컬렉션(모델)확인)-> db.users.find({})(해당 컬렉션(모델)이 가지고 있는 데이터 확인)
      // 정상적으로 확인이 된다면 { "_id" : ObjectId("606076d7dc95022f888d1b8e"), "name" : "admin1", "email" : "admin1@gmail.com", "salt": "이상한 값들", "hash": "이상한 값들", "__v": 0 }과 같은 정보를 확인할 수 있다.
      // 등록한 사용자에 대한 정보를 DB가 보여준 것이다. 여기서 salt와 hash는 패스워드를 암호화 시켜준 값들이라고 보면 된다. (두 개는 약간 다름. 자세한건 나중에 찾아보기)
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }

    // 사용자 등록, 로그인
    // 비밀번호와 비밀번호 확인이 같으면 routes.home페이지로 리다이렉트함.
    // res.redirect(routes.home);
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = (req, res) => {
  // passport.authenticate('local')을 통해 passport에게 local전략(strategy)으로 인증하라고 알려준다. (local전략은 passport-local 모듈을 통해 설치되었다.)
  // authenticate()함수는 LocalStrategy에서 사용되는 함수를 생성하고 ()괄호 안에 세부 옵션을 설정할 수 있다.
  // local전략은 사용자 아이디(이 강의에서는 email로 바꿈), 비밀번호 두 개를 검사해서 로그인 인증을 하는 전략이다.
  // 만약 페이스북이나 구글, 카카오등의 다른 서비스를 이용한다면 local자리에 다른 전략이 들어갈 것이다.
  // successRedirect는 성공했을 때 리다이렉트할 라우트 경로이고 failureRedirect는 실패했을 때 리다이렉트할 라우트 경로이다.
  return passport.authenticate("local", {
    successRedirect: routes.home,
    failureRedirect: routes.login,
  });
};

export const logout = (req, res) => {
  return res.redirect(routes.home);
};

// User Controller
export const users = (req, res) => res.render("users", { pageTitle: "Users" });
export const userDetail = (req, res) => res.render("userDetail", { pageTitle: "userDetail" });
export const editProfile = (req, res) => res.render("editProfile", { pageTitle: "editProfile" });
export const changePassword = (req, res) => res.render("changePassword", { pageTitle: "changePassword" });
