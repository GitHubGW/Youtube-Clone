import routes from "./routes";
import multer from "multer"; // multer미들웨어를 사용하기 위해 가져옴

// 가져온 multer 모듈을 실행시킨 후, input을 이용해서 파일을 업로드 하면 multer가 그 파일을 변환해서 저장할 폴더를 설정한다.
const upload = multer({ dest: "uploads/videos/" });

// 로컬 변수를 전역 변수로 만들어주는 미들웨어 함수(전역 변수가 되면 템플릿 엔진인 pug에서 해당 변수를 가져와서 쓸 수 있다)
export const localsMiddleware = (req, res, next) => {
  // console.log("localMiddleware 실행");
  // 미들웨어에서 res.end()메소드를 쓰게 되면 서버와의 연결을 종료할 수 있다.
  res.locals.siteName = "Youtube";
  res.locals.routes = routes; // routes.js를 템플릿 엔진(pug)에서 사용하기 위해 로컬 변수를 전역 변수로 만들어주는 미들웨어에서 가져와서 선언해줌
  res.locals.user = req.user || {}; // passport가 사용자를 로그인 시킬 때 req객체안에 user프로퍼티에 사용자에 대한 정보를 전달해준다.
  // next()는 다음 미들웨어를 호출하는 메소드이다.
  // 미들웨어는 끝나면 항상 next()를 써줘야 다음 함수나 동작으로 넘어간다. (필수)
  next();
};

// single()메소드는 오직 하나의 파일만 업로드한다는 의미이다.
// single()메소드 안에 들어올 값은 form에 우리가 파일을 업로드 하는 input태그가 가지고 있는 name속성 값을 의미한다. (ex: name="videoFile")
// upload.single('avater')처럼 함수를 집어넣으면 multer미들웨어가 파일의 URL을 반환해준다.
export const uploadVideo = upload.single("videoFile");
