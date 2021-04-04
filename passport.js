// passport.js파일은 passport에 대한 설정을 하기 위한 파일이다.
// passport 모듈은 passport를 사용하기 위한 모듈이다. (passport는 모든 종류의 인증을 처리한다.)
// passport-local 모듈은 username과 password를 쓰는 사용자 인증 방식(strategy)을 의미한다. (passport-local은 유저와 패스워드 필드를 사용자가 지정한 모델에 추가해준다.)
import passport from "passport";
import GitHubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
import routes from "./routes";
import { githubLoginCallback, facebookLoginCallback } from "./controllers/userController";
import User from "./models/User";

// passport.use()를 통해 passport에게 strategy를 사용하라고 지정한다.
// 여기서 strategy란 로그인 방식을 의미한다.
// 예를들면 페이스북으로 로그인하기 / 깃허브로 로그인하기 / 아이디와 비밀번호로 로그인하기 / 등등을 말한다.
// 모든 passport의 플러그인들은 사용하려면 전략(strategy)을 짜 주어야 합니다.
// 지금 여기서는 passport-local가 제공하는 전략(strategy)을 사용하라고 하고 있다. (passport-local은 username과 password만으로 로그인하는 방식)
// 몽구스를 통해 만든 User모델을 가져와서 User.createStrategy()를 통해 User모델에게 LocalStrategy 전략(strategy)을 생성해준다.
// createStrategy()함수는 기본적으로 LocalStrategy(아이디(username)과 비밀번호만을 인증하는 전략)라는 전략(strategy)을 생성한다.
passport.use(User.createStrategy());

// Passport를 이용한 깃허브 인증 방법
// 1. 깃허브 개발자 페이지에서 어플리케이션 등록을 한다.
// 2. 패스포트를 이용해 깃허브 전략(Strategy)을 등록하고 설정해준다. (깃허브 전략은 passport-github 패키지를 설치해서 사용할 수 있다.)
passport.use(
  // GitHubStrategy 전략을 만들 때 clientID, clientSecret, callbackURL등의 값들을 넣어줘야 한다.
  // 깃허브 페이지에 갔다가 인증이 완료되면 콜백URL로 돌아오면서 사용자 정보를 같이 가지고 온다.
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      // 깃허브 인증이 완료되면 콜백 URL주소로 오게 된다. (인증이 성공적으로 되었다는 의미는 로그인 되었다는 의미로 볼 수 있다.)
      // 콜백 주소로 오게 되면 아래 githubLoginCallback함수를 실행하게 되고 정상적으로 실행이 되었다면 postGithubLogin 함수를 실행하고 그렇지 않다면 failureRedirect 부분을 실행하게 된다.
      // globalRouter.get(routes.githubCallback, passport.authenticate("github", { failureRedirect: "/login" }), postGithubLogin);
      // 그래서 만약 githubLoginCallback에서 cb함수가 cb(error) 에러를 리턴하면 패스포트는 에러가 있음을 알고 /login화면으로 보내버리고
      // cb(null, user)를 리턴하면 error가 null(없음)이고 user가 있다고 인지해서 postGithubLogin함수를 실행하는 것이다.
      callbackURL: `http://localhost:4000${routes.githubCallback}`,
    },
    // 아래 함수는 사용자가 깃허브 인증이 끝나고 돌아왔을 때 실행되는 콜백함수이다.
    githubLoginCallback
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `http://localhost:4000${routes.facebookCallback}`,
    },
    facebookLoginCallback
  )
);

// passport.serializeUser()와 passport.deserializeUser()를 통해 Passport가 사용자 인증을 처리할 수 있도록 설정한다.
// Serialization은 어떤 필드(field)가 쿠키에 포함될 것인지를 설정해 쿠키가 어떤 정보를 가질 수 있는지 지정한다. 지금 웹 브라우저에 있는 사용자의 정보중에 어떤 정보를 가질 수 있는지를 정의한다.
// Deserialization은 가지고 있는 쿠키의 정보를 어떻게 사용자로 전환할지를 설정한다.
// passport.serializeUser(함수): 앞에 serializeUser()는 passport가 가지고 있는 함수이고 뒤에 serializeUser()는 passport-local-mongoose 모듈이 가지고 있는 shortcut(단축어)함수이다.
// (passport에서 직접 써야할 함수를 passport-local 모듈에서 간단히 줄여서 쓴 것이라는 의미이다.)
// 아래와 같이 하면 passport에게 오직 user.id만 쿠키에 담아서 보내도록 설정한다.
// 일반적으로 쿠키에 user.id를 담고 그 id를 이용해 사용자를 식별한다.

// serialize시에 session에서는 user.id인 사용자 id값만 저장하고, deserialize시에는 session에 저장된 id를 이용해서, DB에 매번 사용자 정보를 select하는 모습을 볼 수 있다
// [사용자 인증 성공시 호출]
// passport.serializeUser(): 패스포트를 이용해 사용자 정보를 세션에 아이디로 저장한다. (이렇게 id만 저장하면 세션 용량이 커지는 걸 막을 수 있다.)
// passport.serializeUser(User.serializeUser());
passport.serializeUser((user, done) => done(null, user));

// [사용자 인증 이후 사용자 요청 시마다 호출]
// passport.deserializeUser(): 패스포트를 이용해 세션에 저장된 아이디를 이용해서 사용자 정보를 가져옴
// 사용자가 페이지를 돌아다닐 때마다 사용자에 대한 정보를 req.user로 받아서 가져온다. (이제 어떤 페이지를 가던지간에 누가 무슨 요청을 하고 있는지 세션 정보를 통해 알 수 있다.)
// passport.deserializeUser(User.deserializeUser());
passport.deserializeUser((user, done) => done(null, user));

// Passport는 웹 사이트에서 인증을 설정하고 처리하기 위한 플러그인이다.
// Passport는 쿠키를 생성하고, 브라우저에 저장시켜주고, 유저에게 해당 쿠키를 줄 것이다.
// 쿠키란 우리가 브라우저에 저장할 수 있는 사용자 정보에 대한 것들이다. 쿠키에는 모든 요청(req)에 대해서 백엔드로 전송될 정보들이 담겨져 있다.
// 인증이란 브라우저 상에 쿠키를 설정해주면 그 쿠키를 통해서 사용자 정보 등을 알 수 있고 Passport가 브라우저에서 자동으로 쿠키를 가져와서 인증이 완료된 유저에게 User객체를 컨트롤러에 넘겨줄 것이다.

/*
깃허브 로그인 부분에서 Error: Failed to serialize user into session 에러가 발생해서 강의 코드에서 아래와 같이 기존 방식의 코드로 변경했다. 
passport.serializeUser(User.serializeUser());
-> passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser(User.deserializeUser());
-> passport.deserializeUser((user, done) => done(null, user));
*/
