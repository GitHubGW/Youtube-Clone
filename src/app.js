// const express = require('express'); // require를 통해 express를 가져옴
// 위에 require대신에 자바스크립트 최신 문법인 import를 사용해서도 express에서 가져올 수 있다. (단 import를 사용하기 위해서는 Babel이 필요함)
import "@babel/polyfill";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import passport from "passport";
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import flash from "express-flash";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRouter";
import routes from "./routes"; // routes.js에서 export default(내보내기 기본값)를 routes라는 상수로 지정했기 때문에 import해오는 기본적인 값은 routes라는 상수안에 있는 값이 됨.
import { localsMiddleware } from "./middlewares";

// import MongoStore from "connect-mongo";
// connect-mongo는 세션을 몽고 DB와 연결해 세션의 정보를 몽고 DB에 저장하기 위해 사용하는 플러그인이다.
// 일반적으로 세션의 정보는 메모리에 저장되는데 그렇게 되면 서버가 날라가거나 재시작하게 됐을 때 메모리도 초기화되면서 세션 정보가 없어져 버린다.
// 그래서 이런 문제를 방지하기 위해 세션 정보들을 데이터베이스에 연결해서 저장하기 위한 connect-mongo를 사용한다.

// 아래에서 passport를 미들웨어로 쓰기위해 여기에 import해왔다. (passport.initialize()과 passport.session()을 쓰기 위해서)
// app.use(passport)를 실행하면 passport.js에 있는 모든 전략을 자동으로 찾는다.
import "./passport";

// 가져온 express를 실행해서 서버를 만듬
const app = express();

// helmet 미들웨어는 기본적인 보안설정을 검사해주는 미들웨어이다. (주로 서버를 생성하고 가장 먼저 실행해주는 것이 좋다.)
// 외부에서 가져온 비디오가 재생되지 않는 문제가 발생했는데 원인은 helmet의 미들웨어 중에 helmet.contentSecurityPolicy()라는 CSP설정을 해주는 함수가 원인이었다.
// 과거에는 app.use(helmet())을 사용할 경우 기본적인 보안설정만 해주었는데 현재는 CSP설정도 포함되어 이러한 문제가 발생한다. (추후에는 contentSecurityPolicy: false를 다시 없애줘야 함)
app.use(helmet({ contentSecurityPolicy: false }));

// app.set()은 application의 몇몇 설정을 할 때 사용하는 함수이다.
// express에서 사용할 view engine를 pug로 설정함.
app.set("view engine", "pug");

// express에서 사용할 뷰 엔진의 경로를 설정함(기본값은 views폴더).
// 기본값으로 쓸 때는 설정해줄 필요없고 views폴더가 아닌 다른 폴더로 설정할 때 두 번째 경로를 변경해주면 된다.
// app.set("views", "./views");

// 경로를 찾을 때 사용하는 path모듈을 가져와서 path.join()을 통해 뷰 엔진의 경로를 다시 재 설정해줌.
// __dirname은 현재 실행되고 있는 파일의 상위 경로(폴더)를 의미한다.
app.set("views", path.join(__dirname, "views"));

// uploads 라우트로 req 요청이 오면 express.static("uploads")를 통해 express의 기본 static파일 경로를 uploads폴더로 설정한다.
// 설정하게 되면 upload 라우트로 들어왔을 때 uploads폴더 안에 있는 파일을 보내주게 된다.
// 쉽게 말해 uploads 경로로 들어오면 uploads폴더 안에 파일을 실행시키라는 의미임
// 나중에 AWS S3를 생성한 후에는 거기에 비디오 파일과 아바타 파일 등을 저장하기 때문에 더 이상 아래 uploads가 필요하지 않아서 주석 처리했음.
// app.use("/uploads", express.static("uploads"));

// static라우트를 만들고 static라우트로 들어오려 하면 static폴더를 보여주게 된다.
// app.use("/static", express.static("static"));

app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/images", express.static(path.join(__dirname, "images")));

// cookieParser는 사용자 인증에 필요한 cookie를 전달 받는다.
app.use(cookieParser());

// bodyParser미들웨어는 클라이언트가 서버에 request(req)했을 때 request객체안에 있는 정보를 가져와준다.
// 만약 bodyParser가 없으면 req객체에 대한 정보를 가져오지 못한다. (즉, req.body를 통해 사용자가 입력한 form이나 여러 request한 정보들을 가져오지 못하고 undefined로 가져온다)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// morgan은 nodeJS에서 로그 관리를 하기 위한 미들웨어이다. (application에서 발생하는 모든 일을 기록한다.)
app.use(morgan("dev"));

// flash()를 통해 express-flash를 실행한다.(로컬 메세지를 띄울 수 있도록 설정해준다. 여기서 로컬이란 middlewares.js에서 선언한 변수들처럼 전역 변수 형태를 의미한다.)
// express-flash란 사용자에게 일종의 알림 역할을 하는 메세지를 보낼 수 있게 해주는 모듈이다.
app.use(flash());

// express-session은 세션을 관리하기 위한 플러그인이자 미들웨어 함수이다.
// session 데이터는 쿠키에 저장되지 않고 서버 측에 저장된다. (쿠키에는 오로지 세션 아이디만 저장된다.)
// 쿠키를 이용하기 위해서는 express-session으로 설정을 해줘야 한다.
// 기타: CookieStore라는 것이 있는데 쿠키 스토어를 사용하지 않으면 쿠키를 영구적으로 저장할 수 없다.

// 과정
// 사용자가 로그인을 하게 되면 express-session을 통해 쿠키는 암호화가 되서 express로 보내진다. (express는 세션을 이용함으로서 쿠키를 가질 수 있는 것이다.)
// 그리고 패스포트는 세션을 이용해서 암호화된 쿠키를 복호화한다. (세션을 이용한다는 의미는 세션이 가진 쿠키를 이용한다는 것을 의미한다)
// 세션은 이용하는 이유는 복잡한 문자열로 되어있는 쿠키를 복호화(암호화되있는 것을 풀음)하기 때문이다.
// 복호화하게 되면 복잡한 문자열을 가진 쿠키가 실제 id가 되서 패스포트로 넘어가게 된다.
// 패스포트로 넘어가게 되면 deserialize 함수를 실행하고, deserialize 함수를 통해 사용자를 식별하게 되면 패스포트는 방금 찾은 사용자에 대한 정보를 미들웨어나 routes의 req객체에 user로 할당하게 되는 것이다.(req.user)
// (deserialize: 세션에 저장된 아이디를 이용해 사용자 정보를 가져오는 것)
// 그렇게 되면 이제 어떤 route에서든지 간에 로그인한 사용자가 누구인지 확인할 수 있는 것이다.
// 기본적으로 쿠키에는 세션 id가 있고 우리는 DB에 사용자 정보와 함께 세션 id를 저장한다.
// 그래서 우리는 쿠키를 이용해서 DB에 세션id를 찾고 사용자 정보를 찾을 수 있는 것이다.

// session(): 세션을 설정한다. (session()안에 다양한 옵션들을 줄 수 있다.)
// secret: 우리는 쿠키에 들어있는 세션 id를 전송할 때 id값을 그대로 보내면 안된다. 그래서 세션 id를 랜덤 문자열로 암호화하기 위한 설정이다.
// 이 값을 통하여 세션을 암호화하여 저장한다. (반드시 필요한 옵션)
// resave: 세션을 강제로 저장하게 하는 설정이다. express-session 문서에서는 false로 하는 것을 권장하고 필요에 따라 true로 설정한다.
// saveUninitialized: 초기화되지 않은 세션을 저장소에 저장할 것인지 설정한다. 초기화 되지 않은 세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장할 것인지 설정함.
// (로그인 세션을 이용하려면 false를 선택하는 것이 좋음)
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    // 세션과 몽고디비를 연결주고, 세션에게 데이터를 MongoStore라는 저장소에 저장하라고 설정함
    // 세션과 몽고디비가 연결되게 되면 서버가 재시작된다해도 우리는 쿠키를 계속 보존할 수 있고 여전히 로그인 상태를 유지할 수 있다.
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL_PRODUCTION, // MONGO_URL로 실습하다가 마지막 배포전에 MongoDB Atlas를 실습하면서 MONGO_URL_PRODUCTION으로 바꿨음
    }),
  })
);

// Passport를 사용하기 위해서는 패스포트 구성을 위해 passport.initialize(), passport.session() 미들웨어를 실행해줘야 한다.
// 이 두개의 함수를 호출하게 되면 반환되는 객체(req.user)를 미들웨어에서 사용할 수 있다.
// passport관련 함수들은 라우트들을 정의한 곳보다 위쪽에 먼저 선언되 있어야 한다. (cookieParser보다도 위에 위치해야함. 먼저 패스포트가 인증처리한 후 쿠키가 실행되야 하기 때문이다.)
// passport.initialize(): passport를 초기화해줌.
// 그 후 passport는 쿠키를 들여다봐서 그 쿠키 정보에 해당되는 사용자를 찾아준다.
// 그리고 passport는 자기가 찾은 쿠키 정보를 req객체에 user로 전달해준다.(req.user)
// 정리하자면 passport는 쿠키를 들여다보고 쿠키 정보를 받아서 받은 정보에 해당하는 데이터를 req객체에게 전달해준다.

app.use(passport.initialize()); // passport를 실행시킨다.

app.use(passport.session()); // passport로 하여금 세션을 저장하고 세션을 연결한다.

app.use(localsMiddleware);

// app.use()를 통해 기본 라우팅 설정
// 중요! app.get()은 HTTP GET요청에 대해서만 처리하지만 app.use()는 GET, POST등등 모든 요청에 대해서 처리한다.
// 해당 라우트 경로에 request했을 때(첫 번째 값) 해당 라우터를 미들웨어로 실행함(두 번째 값)
// routes.home(/)라우트에 들어와서 request했을 때 globalRouter라는 미들웨어 함수를 실행함
// 여기서 라우트들도 미들웨어에 속하며 next를 호출하지 않지만 res객체를 통해 연결을 끝내는 역할을 한다.
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

// export default를 쓰면 app을 기본적으로 export한다는 의미이고, 변수 앞에 export를 붙여서 const export app를 쓰면 해당 변수만 export한다는 의미이다.
// const app을 다른 곳에서 불러와서 쓸 수 있도록 export함
export default app;

// MVC패턴
// M(Model): 실제 데이터를 담당하는 부분이다.
// V(View): template(템플릿. ex: pug, ejs등)를 말하며 데이터가 화면에 보여지는 것을 담당하는 부분이다.
// C(Controller): 데이터의 로직, 처리 등을 담당하는 부분이다.
