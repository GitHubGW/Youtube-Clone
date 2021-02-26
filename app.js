// const express = require('express'); // require를 통해 express를 가져옴
// 위에 require대신에 자바스크립트 최신 문법인 import를 사용해서도 express에서 가져올 수 있다. (단 import를 사용하기 위해서는 Babel이 필요함)
import express from "express"; 
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter";
import videoRouter from './routers/videoRouter';
import globalRouter from './routers/globalRouter';
import routes from './routes';

const app = express(); // 가져온 express를 실행해서 서버를 만듬

// 미들웨어 실행
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.use(morgan("dev"));

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter); // users라우트에 들어와서 request했을 때 userRouter라는 미들웨어 함수를 실행함
app.use(routes.videos, videoRouter);
// export default를 쓰면 app전체를 export한다는 의미이고, 변수 앞에 export를 붙여서 const export app를 쓰면 해당 변수만 export한다는 의미이다.
export default app; //app.js를 다른 곳에서 불러와서 쓸 수 있도록 export함
