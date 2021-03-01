// const express = require('express'); // require를 통해 express를 가져옴
// 위에 require대신에 자바스크립트 최신 문법인 import를 사용해서도 express에서 가져올 수 있다. (단 import를 사용하기 위해서는 Babel이 필요함)
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes"; // routes.js에서 export default(내보내기 기본값)를 routes라는 상수로 지정했기 때문에 import해오는 기본적인 값은 routes라는 상수안에 있는 값이 됨.
import { localsMiddleware } from "./middlewares";

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
// 만약 bodyParser가 없으면 req객체에 대한 정보를 가져오지 못한다. (즉, req.body를 통해 사용자가 입력한 form아나 여러 request한 정보들을 가져오지 못하고 undefined로 가져온다)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(localsMiddleware);

// app.use()를 통해 기본 라우팅 설정
// 해당 라우트 경로에 request했을 때(첫 번째 값) 해당 라우터를 미들웨어로 실행함(두 번째 값)
// routes.home(/)라우트에 들어와서 request했을 때 globalRouter라는 미들웨어 함수를 실행함
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

// export default를 쓰면 app전체를 export한다는 의미이고, 변수 앞에 export를 붙여서 const export app를 쓰면 해당 변수만 export한다는 의미이다.
export default app; //app.js를 다른 곳에서 불러와서 쓸 수 있도록 export함
