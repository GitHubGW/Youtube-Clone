// passport.js파일은 passport에 대한 설정을 하기 위한 파일이다.
// passport 모듈은 passport를 사용하기 위한 모듈이다. (passport는 모든 종류의 인증을 처리한다.)
// passport-local 모듈은 username과 password를 쓰는 사용자 인증 방식(strategy)을 의미한다. (passport-local은 유저와 패스워드 필드를 사용자가 지정한 모델에 추가해준다.)
import passport from "passport";
import User from "./models/User";

// passport.use()를 통해 passport에게 strategy를 사용하라고 지정한다.
// 여기서 strategy란 로그인 방식을 의미한다.
// 예를들면 페이스북으로 로그인하기 / 깃허브로 로그인하기 / 아이디와 비밀번호로 로그인하기 / 등등을 말한다.
// 모든 passport의 플러그인들은 사용하려면 전략(strategy)을 짜 주어야 합니다.
// 지금 여기서는 passport-local가 제공하는 전략(strategy)을 사용하라고 하고 있다. (passport-local은 username과 password만으로 로그인하는 방식)
// 몽구스를 통해 만든 User모델을 가져와서 User.createStrategy()를 통해 User모델에게 LocalStrategy 전략(strategy)을 생성해준다.
// createStrategy()함수는 기본적으로 LocalStrategy(아이디(username)과 비밀번호만을 인증하는 전략)라는 전략(strategy)을 생성한다.
passport.use(User.createStrategy());

// passport.serializeUser()와 passport.deserializeUser()를 통해 Passport가 사용자 인증을 처리할 수 있도록 설정한다.
// Serialization은 어떤 필드(field)가 쿠키에 포함될 것인지를 설정해 쿠키가 어떤 정보를 가질 수 있는지 지정한다. 지금 웹 브라우저에 있는 사용자의 정보중에 어떤 정보를 가질 수 있는지를 정의한다.
// Deserialization은 가지고 있는 쿠키의 정보를 어떻게 사용자로 전환할지를 설정한다.
// passport.serializeUser(함수): 앞에 serializeUser()는 passport가 가지고 있는 함수이고 뒤에 serializeUser()는 passport-local-mongoose 모듈이 가지고 있는 shortcut(단축어)함수이다.
// (passport에서 직접 써야할 함수를 passport-local 모듈에서 간단히 줄여서 쓴 것이라는 의미이다.)
// 아래와 같이 하면 passport에게 오직 user.id만 쿠키에 담아서 보내도록 설정한다.
// 일반적으로 쿠키에 user.id를 담고 그 id를 이용해 사용자를 식별한다.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Passport를 사용해서 웹사이트의 인증을 설정해줄 것이다.
// Passport는 쿠키를 생성하고 브라우저에 저장시켜주고 유저에게 해당 쿠키를 줄 것이다.
// 인증이란 브라우저 상에 쿠키를 설정해주면 그 쿠키를 통해서 사용자 정보등을 알 수 있을 것이고
// Passport가 브라우저에서 자동으로 쿠키를 가져와서 인증이 완료된 유저에게 User객체를 컨트롤러에 넘겨줄 것이다.
// 쿠키란 우리가 브라우저에 저장할 수 있는 사용자 정보에 대한 것들이다.
// 쿠키에는 모든 요청(req)에 대해서 백엔드로 전송될 정보들이 담겨져 있다.
