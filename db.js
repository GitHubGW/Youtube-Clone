import mongoose from "mongoose";
import dotenv from "dotenv";

// dotenv.config(): .env파일(DB정보를 숨기기 위한 파일)안에 있는 정보들을 로드해와서 process.env.key(키)에 저장한다.
dotenv.config();

// mongoose.connect()를 통해 데이터베이스와 연결할 때 지정할 속성을 설정함
// MongoDB URL : "mongodb://localhost:포트번호/Database이름" (포트번호는 mongod를 실행후 port에서 찾을 수 있음)
// process.env.MONGO_URL을 통해 .env에 저장되어있는 키의 벨류값을 가져올 수 있다
mongoose.connect(process.env.MONGO_URL, {
  // mongoose를 통해 mongodb에 연결하면서 환경설정을 설정해서 보낼 수 있음.
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// mongoose를 통해 mongodb와 연결함
const db = mongoose.connection;

// DB에 성공적으로 연결됐을 때 실행하는 함수
const handleOpen = () => {
  console.log("✅ Connected to MongoDB");
};

// DB에 연결이 실패했을 때 실행하는 함수
const handleError = (error) => {
  console.log("Error on DB Connection:", error);
};

// once()는 db를 한번만 실행하는 함수(DB는 최초 한 번만 실행되고 계속 실시간으로 실행될 필요가 없다)
// DB에 성공적으로 연결됐을 때(open) handleOpen함수를 실행함
db.once("open", handleOpen);

// on()은 db를 실시간으로 듣고 있음. 그러다가 에러가 발생하면 handleError함수를 통해 error를 보여줌.
db.on("error", handleError);
