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
app.use(helmet());
app.use(cookieParser());
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