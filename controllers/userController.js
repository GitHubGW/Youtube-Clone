import passport from "passport";
import routes from "../routes";
import User from "../models/User";

// Global Controller
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  // console.log(req.body); // bodyParser가 없으면 req객체안에 있는 값들을 가져오지 못한다. (req.body를 해도 undefined가 뜸)
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

// postLogin변수에 passport.authenticate()를 실행한 값을 넣는다.
// passport.authenticate('local')을 통해 passport에게 local전략(strategy)으로 인증하라고 알려준다. (local전략은 passport-local 모듈을 통해 설치되었다.)
// authenticate()함수는 LocalStrategy에서 사용되는 함수를 생성하고 ()괄호 안에 세부 옵션을 설정할 수 있다.
// local전략은 사용자 아이디(이 강의에서는 email로 바꿈), 비밀번호 두 개를 검사해서 로그인 인증을 하는 전략이다.
// 만약 페이스북이나 구글, 카카오등의 다른 서비스를 이용한다면 local자리에 다른 전략이 들어갈 것이다.
// successRedirect는 성공했을 때 리다이렉트할 라우트 경로이고 failureRedirect는 실패했을 때 리다이렉트할 라우트 경로이다.
export const postLogin = passport.authenticate("local", {
  successRedirect: routes.home,
  failureRedirect: routes.login,
});

// GitHub OAuth
// 패스포트를 이용해 깃허브 전략을 인증한다. (전에 passport.authenticate("local")을 했던 것과 비슷하다.)
export const githubLogin = passport.authenticate("github");

// 깃허브에서 인증 후 콜백 URL경로에 왔을 때 실행되는 콜백 함수이다.
// accessToken, refreshToken, profile, cb의 인자를 쓸 수 있다.
// accessToken에는 접근 가능한 토큰을 보여준다.
// profile에는 사용자에 대한 정보들이 담겨져 있는 객체이다.
// cb는 패스포트에서 제공하는 콜백함수이다. 인증에 성공한 상황에서 최종적으로 호출이 되야 하는 함수이다. (최종적으로 return해줘야 함.)
// 그리고 이 cb함수는 error가 있는지 user가 있는지 알려줘야 한다.
// 기타: (accessToken, refreshToken, profile, cb) 여기에서 사용하지 않는 파라미터가 있다면 (_, __, profile, cb)로 쓸 수도 있다. (또 다른 스타일)
export const githubLoginCallback = async (accessToken, refreshToken, profile, cb) => {
  // console.log(accessToken, refreshToken, profile, cb);

  // profile안에 _json객체 안에 있는 필요한 정보들을 가져옴(아이디, 아바타 url, 이름, 이메일)
  // avatar_url를 카멜케이스인 avatarUrl로 바꿔줬다.
  const {
    _json: { id, avatar_url: avatarUrl, name, email },
  } = profile;

  try {
    // 위에서 가져온 정보 중에 email을 가지고 User모델에 있는 이메일과 같은 데이터를 찾는다.
    // 깃허브에서 가져온 이메일과 User모델이 가지고 있는 이메일이 동일한지 확인함
    const user = await User.findOne({
      email,
    });
    // console.log(user);

    // 만약 깃허브에서 가져온 이메일과 User모델이 가지고 있는 이메일이 동일한 사람이 있다면
    // 그 사람의 githubId를 깃허브에서 가져온 id값으로 갱신하고 user.save()메소드를 이용해서 User모델을 업데이트 해준다.
    // 마지막으로 이메일이 동일한 사용자를 찾았다면 패스포트는 return cb(null, user)를 통해 cb함수를 호출한다.
    // cb함수의 첫 번째 인자에는 에러가 있다면 error를 없다면 null을 넣어주고 두 번째 인자에는 찾은 user값을 넣어준다. (이 user값은 쿠키에 저장되게 된다.)
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    } else {
      // 만약 깃허브에서 가져온 이메일과 User모델이 가지고 있는 이메일이 동일한 사람을 찾지 못했다면
      // User모델에 하나의 스키마(도큐먼트)를 생성한다.
      // 마지막으로 이메일이 동일한 사용자를 찾지 못했다면 return cb(null, newUser)를 통해 cb함수를 호출하고 두 번째 인자로 newUser를 넘겨준다.
      const newUser = await User.create({
        email,
        name,
        githubId: id,
        avatarUrl,
      });
      return cb(null, newUser);
    }
  } catch (error) {
    // cb함수가 error를 리턴하면 패스포트는 user가 없고 에러가 있다고 인식하고 끝낸다.
    return cb(error);
  }
};

export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};

// Facebook OAuth
export const facebookLogin = passport.authenticate("facebook");

export const facebookLoginCallback = (accessToken, refreshToken, profile, cb) => {
  console.log(accessToken, refreshToken, profile, cb);
};

export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  // 패스포트를 이용해 간단하게 로그아웃 기능을 사용할 수 있다. (쿠키, 세션 등등을 모두 알아서 처리해준다.)
  req.logout();
  return res.redirect(routes.home);
};

// User Controller
export const getMe = (req, res) => res.render("userDetail", { pageTitle: "Me", user: req.user }); // user에 req.user의 값을 전달함(req.user는 현재 로그인한 사용자에 대한 정보임)
export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  console.log(id);

  try {
    // User.findById(id)를 통해 req.params.id의 값에 해당하는 데이터를 User모델에서 찾는데 만약 여기서 에러가 생기면 catch문으로 가게 된다.
    const user = await User.findById(id);
    res.render("userDetail", { pageTitle: "userDetail", user });
  } catch (error) {
    // console.log(error);
    res.redirect(routes.home);
  }
};
export const editProfile = (req, res) => res.render("editProfile", { pageTitle: "editProfile" });
export const changePassword = (req, res) => res.render("changePassword", { pageTitle: "changePassword" });
