// const express = require('express'); // require를 통해 express를 가져옴
// 위에 require대신에 자바스크립트 최신 문법인 import를 사용해서도 express에서 가져올 수 있다. (단 import를 사용하기 위해서는 Babel이 필요함)
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes"; // routes.js에서 export default(내보내기 기본값)를 routes라는 상수로 지정했기 때문에 import해오는 기본적인 값은 routes라는 상수안에 있는 값이 됨.
import { localsMiddleware } from "./middlewares";

// 아래에서 passport를 미들웨어로 쓰기위해 여기에 import해왔다.
// passport.initialize()과 passport.session()을 쓰기 위해서
// app.use(passport)를 실행하면 passport.js에 있는 모든 전략을 자동으로 찾는다.
import "./passport";

// express-session은 session을 관리해주기 위해 필요한 플러그인이다.
// 쿠키를 이용하기 위해서는 express-session으로 설정을 해줘야 한다.

const app = express(); // 가져온 express를 실행해서 서버를 만듬

// app.set()은 application의 몇몇 설정을 할 때 사용하는 함수이다.
// express에서 사용할 view engine를 pug로 설정함.
app.set("view engine", "pug");
// express에서 사용할 뷰 엔진의 경로를 설정함(기본값은 views폴더).
// 기본값으로 쓸 때는 설정해줄 필요없고 views폴더가 아닌 다른 폴더로 설정할 때 두 번째 경로를 변경해주면 된다.
app.set("views", "./views");

// 미들웨어 실행
// app.use(helmet());
// 외부에서 가져온 비디오가 재생되지 않는 문제가 발생했는데 원인은 helmet의 미들웨어 중에 helmet.contentSecurityPolicy()라는 CSP설정을 해주는 함수가 원인이었다.
// 과거에는 app.use(helmet())을 사용할 경우 기본적인 보안설정만 해주었는데 현재는 CSP설정도 포함되어 이러한 문제가 발생한다. (추후에는 contentSecurityPolicy: false를 다시 없애줘야 함)
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cookieParser());
// bodyParser미들웨어는 클라이언트가 서버에 request(req)했을 때 request객체안에 있는 정보를 가져와준다.
// 만약 bodyParser가 없으면 req객체에 대한 정보를 가져오지 못한다. (즉, req.body를 통해 사용자가 입력한 form이나 여러 request한 정보들을 가져오지 못하고 undefined로 가져온다)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev")); // morgan은 nodeJS에서 로그 관리를 하기 위한 미들웨어이다.
app.use(localsMiddleware);
// /uploads 라우트로 req 요청이 오면 express.static("uploads")를 통해 express의 기본 static파일 경로를 uploads폴더로 설정한다.
// 설정하게 되면 uploads폴더 안에 있는 파일을 보내주게 된다.
app.use("/uploads", express.static("uploads"));

// static라우트를 만들고 static라우트로 들어오려 하면 static폴더를 보여주게 된다.
app.use("/static", express.static("static"));

// passport관련 함수들은 라우트들을 정의한 곳보다 위쪽에 먼저 선언되 있어야 한다.
// 또한 cookieParser()보다는 뒤에 위치해야 한다.
// passport.initialize(): passport를 초기화해줌.
// 위에서 실행된 cookieParser로부터 쿠키가 쭉 여기까지 내려와서 passport를 초기화시켜준다.
// passport는 쿠키를 들여다봐서 그 쿠키 정보에 해당되는 사용자를 찾아준다.
// 찾은 사용자에 대한 정보를 req객체에 user프로퍼티에 전달해준다.
app.use(passport.initialize());

// passport.session(): passport가 session이라는 것을 저장해준다.
app.use(passport.session());

// app.use()를 통해 기본 라우팅 설정
// 중요! app.get()은 HTTP GET요청에 대해서만 처리하지만 app.use()는 GET, POST등등 모든 요청에 대해서 처리한다.
// 해당 라우트 경로에 request했을 때(첫 번째 값) 해당 라우터를 미들웨어로 실행함(두 번째 값)
// routes.home(/)라우트에 들어와서 request했을 때 globalRouter라는 미들웨어 함수를 실행함
// 여기서 라우트들도 미들웨어에 속하며 next를 호출하지 않지만 res객체를 통해 연결을 끝내는 역할을 한다.
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

// export default를 쓰면 app을 기본적으로 export한다는 의미이고, 변수 앞에 export를 붙여서 const export app를 쓰면 해당 변수만 export한다는 의미이다.
export default app; // const app을 다른 곳에서 불러와서 쓸 수 있도록 export함

// MVC패턴
// M(Model): 실제 데이터를 담당하는 부분이다.
// V(View): template(템플릿. ex: pug, ejs등)를 말하며 데이터가 화면에 보여지는 것을 담당하는 부분이다.
// C(Controller): 데이터의 로직, 처리 등을 담당하는 부분이다.
