// db.js에서 export하지 않고도 import해올 수 있는 이유는 파일 내부의 함수가 아니라 db 파일 자체를 가져왔기 때문이다.
// db.js파일을 가져오면 그 파일안에 내용들이 실행되기 때문에 DB가 실행되는 것이다.
import "./db";
import app from "./app";
import dotenv from "dotenv";
import "./models/Video"; // models/Video모델을 사용하기 위해 import해왔다. import해오게 되면 mongoose는 해당 모델을 인지해서 등록한다.

dotenv.config();

const PORT = process.env.PORT || 4000;

const handleListening = () => {
  console.log(`✅ Listening on: http://localhost:${PORT}`);
};

// 서버는 지정된 포트 번호를 듣고 있다가 해당 포트 번호로 request가 오면 콜백함수로 handleListening를 실행함
app.listen(PORT, handleListening);
