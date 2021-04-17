import "@babel/polyfill";
// db.js에서 export하지 않고도 import해올 수 있는 이유는 파일 내부의 함수나 변수를 가져온 것이 아니라 그냥 db파일 자체를 가져왔기 때문이다.
// db.js파일을 가져오면 그 파일안에 내용들이 자동으로 실행되기 때문에 DB가 실행되는 것이다.
import "./db";
import dotenv from "dotenv";
import app from "./app";

// models/Video모델을 사용하기 위해 import해왔다.
// import해오게 되면 mongoose는 해당 모델을 인지해서 등록한다.
// import해주는 순간 스키마가 등록(model 메소드가 호출)되어서 앞으로 DB 작업을 할 때 스키마에 맞춰 검사한다.
import "./models/Video";
import "./models/User";
import "./models/Comment";

// dotenv.config();를 통해 .env파일안에 있는 환경 변수를 불러온다.
dotenv.config();

// process.env안에 PORT변수를 가져와서 넣고 만약 값이 없으면 ||(or)로 4000을 넣는다
const PORT = process.env.PORT || 4000;

const handleListening = () => {
  console.log(`✅ Listening on: http://localhost:${PORT}`);
};

// 서버는 지정된 포트 번호를 듣고 있다가 해당 포트 번호로 request가 오면 콜백함수로 handleListening를 실행함
app.listen(PORT, handleListening);
