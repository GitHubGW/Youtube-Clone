// multer는 우리가 파일을 업로드했을 때 그 업로드한 파일을 받아서 데이터베이스에 저장하고 우리에게 file URL을 반환해주는 역할을 하는 미들웨어이다.
// 우리는 파일을 업로드하면 파일의 이름을 통해 해당 파일을 로드해오는게 아니라 해당 파일의 URL을 통해 로드해오게 된다.
// multer미들웨어를 사용하기 위해 가져옴
import multer from "multer";
import routes from "./routes";

// 가져온 multer 모듈을 실행시킨 후, input을 이용해서 파일을 업로드 하면 multer가 그 파일을 변환해서 저장할 폴더를 설정한다.
const upload = multer({ dest: "uploads/videos/" });

// 로컬 변수를 전역 변수로 만들어주는 미들웨어 함수(전역 변수가 되면 템플릿 엔진인 pug에서 해당 변수를 가져와서 쓸 수 있다)
export const localsMiddleware = (req, res, next) => {
  // console.log("localMiddleware 실행");
  // 미들웨어에서 res.end()메소드를 쓰게 되면 서버와의 연결을 종료할 수 있다.
  res.locals.siteName = "Youtube";
  res.locals.routes = routes; // routes.js를 템플릿 엔진(pug)에서 사용하기 위해 로컬 변수를 전역 변수로 만들어주는 미들웨어에서 가져와서 선언해줌

  // passport가 인증을 완료하고 나면 최종적으로 사용자에 대한 정보를 req객체안에 user로 전달해준다. 그럼 req.user를 미들웨어에서 가져와서 사용할 수 있는 것이다.
  // req.user값이 없다면 null을 반환한다.
  res.locals.user = req.user || null;

  console.log("req.user", req.user);

  // next()는 다음 미들웨어를 호출하는 메소드이다.
  // 미들웨어는 끝나면 항상 next()를 써줘야 다음 함수나 동작으로 넘어간다. (필수)
  next();
};

// 로그인한 상태인지 체크하는 함수이다.
export const onlyPublic = (req, res, next) => {
  // req.user가 있는지 체크 후 있다면 홈으로 redirect해버림(req.user가 있다는 의미는 로그인이 되어있다는 의미이기 때문이다.)
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

// 로그인된 사용자 전용 페이지인지를 체크하는 함수이다.
export const onlyPrivate = (req, res, next) => {
  // req.user가 있는지 체크 후 있다면 다음 미들웨어 함수로 넘김
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};

// single()메소드는 오직 하나의 파일만 업로드한다는 의미이다.
// single()메소드 안에 들어올 값은 form에 우리가 파일을 업로드 하는 input태그가 가지고 있는 name속성 값을 의미한다. (ex: name="videoFile")
// upload.single('avater')처럼 함수를 집어넣으면 multer미들웨어가 파일의 URL을 반환해준다.
export const uploadVideo = upload.single("videoFile");
