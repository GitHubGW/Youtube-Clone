// const express = require('express'); // require를 통해 express를 가져옴
// 위에 require대신에 자바스크립트 최신 문법인 import를 사용해서도 express에서 가져올 수 있다. (단 import를 사용하기 위해서는 Babel이 필요함)
import express from "express"; 
import morgan from "morgan"; //npm 미들웨어 morgan을 설치 후 가져옴
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import {userRouter} from "./router/router";

const app = express(); // 가져온 express를 실행해서 서버를 만듬

const handleHome = (req, res) => { //handleHome은 req(request obj)와 res(response obj)를 파라미터로 가짐. req에는 브라우저가 보낸 request에 대한 정보를 담고 있고 res에는 서버가 가지고 있는 response에 대한 정보를 가지고 있음.
  console.log(`Start handleHome`);
  res.send("Home Page");
}

const handleProfile = (req, res) => {
  res.send("Profile Page");
}

/*
const handleListening = () => {
  console.log(`Listening on^^: http://localhost:${PORT}`);
}
*/

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.use(morgan("dev"));

app.get("/", handleHome); // 브라우저가 /(root)라우트를 생성후 get방식으로 request를 하면 서버는 콜백 함수로 handleHome을 실행함
app.get("/profile", handleProfile); // profile 라우트를 생성후 get방식으로 request를 보내면 서버는 handleProfile함수를 실행함
app.use("/user", userRouter); // user 라우트에 들어오면 userRouter라는 router를 사용함
// app.listen(PORT, handleListening); // 서버는 지정된 포트 번호를 듣고 있다가 해당 포트 번호로 request가 오면 콜백함수로 handleListening를 실행함

// export default를 쓰면 app전체를 export한다는 의미이고, 변수 앞에 export를 붙여서 const export app를 쓰면 해당 변수만 export한다는 의미이다.
export default app; //app.js를 다른 곳에서 불러와서 쓸 수 있도록 export함
