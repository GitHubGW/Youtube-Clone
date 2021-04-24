// multer는 우리가 파일을 업로드했을 때 그 업로드한 파일을 받아서 데이터베이스에 저장하고 우리에게 file URL을 반환해주는 역할을 하는 미들웨어이다.
// 우리는 파일을 업로드하면 파일의 이름을 통해 해당 파일을 로드해오는게 아니라 해당 파일의 URL을 통해 로드해오게 된다.
// multer미들웨어를 사용하기 위해 가져옴
import multer from "multer";
import multerS3 from "multer-s3"; // AWS S3용 multer storage 엔진이다.
import aws from "aws-sdk"; // aws-sdk(아마존 웹 서비스 소프트웨어 개발 킷)이다.
import routes from "./routes";

// new aws.S3({})를 통해 aws객체를 생성 후 그 안에서 우리가 사용할 S3에 대한 설정을 해준다.
const s3 = new aws.S3({
  // AWS_ACCESS_KEY와 AWS_SECRET_ACCESS_KEY를 가져와서 accessKeyId와 secretAccessKey에 할당해준다.
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // region: "ap-northeast-2", // region을 설정해 아시아 태평양(서울) ap-northeast-2서버로 업로드한 파일을 보내게 된다.
});

// 가져온 multer 모듈을 실행시킨 후, input을 이용해서 파일을 업로드 하면 multer가 그 파일을 변환해서 저장할 폴더를 설정한다.
// const multerVideo = multer({ dest: "uploads/videos/" });
// const multerAvatar = multer({ dest: "uploads/avatars/" });

// 위에 multerVideo와 multerAvatar는 로컬서버 파일을 저장할 때 사용한 방법이고 마지막 배포할 때는 AWS S3를 이용하기 때문에 multer대신 multer S3로 바꾸고 설정도 약간 바꿔줬다.
const multerVideo = multer({
  // multer의 storage를 multerS3로 설정 후 안에 세부 설정을 해줬다. (multer가 저장하는 스토리지(저장공간)을 설정해준 것이다.)
  // storage에는 다양한 설정이 가능하고 기본 값은 node.js 파일 시스템이다.
  storage: multerS3({
    s3,
    acl: "public-read", // acl은 access control lists로 public-read로 설정해서 일반적인 사람들이 읽기 가능하도록 설정해줬다.
    bucket: "youtube-gw/video", // bucket에는 aws에서 생성한 bucket의 이름을 설정해준다. (뒤에 /video를 통해 bucket안에 하나의 폴더를 더 만들어주고 그 안에 비디오를 저장하겠다고 설정해준다.)
  }),
});

const multerAvatar = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "youtube-gw/avatar",
  }),
});

// 로컬 변수를 전역 변수로 만들어주는 미들웨어 함수(전역 변수가 되면 템플릿 엔진인 pug에서 해당 변수를 가져와서 쓸 수 있다)
export const localsMiddleware = (req, res, next) => {
  // console.log("localMiddleware 실행");
  // 미들웨어에서 res.end()메소드를 쓰게 되면 서버와의 연결을 종료할 수 있다.
  res.locals.siteName = "YouTube";
  res.locals.routes = routes; // routes.js를 템플릿 엔진(pug)에서 사용하기 위해 로컬 변수를 전역 변수로 만들어주는 미들웨어에서 가져와서 선언해줌

  // passport는 인증을 완료하고 사용자를 로그인 시키게 되면 자동으로 그 사용자에 대한 정보를 req객체 안에 user로 전달해준다. 그럼 req.user를 미들웨어에서 가져와서 사용할 수 있는 것이다.
  // req.user값이 없다면 null을 반환한다.
  res.locals.loggedUser = req.user || null;

  // console.log(req.user);

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

// single()메소드는 ()괄호안의 name값에 해당하는 업로드한 파일의 정보를 req.file에 받는다.
// multerVideo.single("videoFile")의 의미는 form에 input태그중에 name값이 videoFile인 태그에서 파일을 업로드 했을 때 해당 파일을 변환해서 위에서 설정한 dest 경로에 저장한다는 의미이다.
// multerVideo.single()괄호 안에 함수를 집어넣으면 multer미들웨어가 파일의 URL을 반환해준다.
// export const uploadVideo = multerVideo.single("videoFile");

// videoFile과 thumbnailFile 두 개를 올리기 위해 single()메소드가 아닌 fields메소드를 사용했다.
export const uploadVideo = multerVideo.fields([{ name: "videoFile" }, { name: "thumbnailFile" }]);
export const uploadAvatar = multerAvatar.single("avatar");
