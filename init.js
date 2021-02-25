import app from "./app";

const PORT=4000;

const handleListening= () => {
  console.log(`💥💥💥 Listening on: http://localhost:${PORT} 💥💥💥`);
}

// 서버는 지정된 포트 번호를 듣고 있다가 해당 포트 번호로 request가 오면 콜백함수로 handleListening를 실행함
app.listen(PORT, handleListening);