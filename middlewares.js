import routes from "./routes";

// 로컬 변수를 전역 변수로 만들어주는 미들웨어 함수(전역 변수가 되면 템플릿 엔진인 pug에서 해당 변수를 가져와서 쓸 수 있다)
export const localsMiddleware = (req, res, next) => {
  // console.log("localMiddleware 실행");
  res.locals.siteName = "Youtube";
  res.locals.routes = routes; // routes.js를 템플릿 엔진(pug)에서 사용하기 위해 로컬 변수를 전역 변수로 만들어주는 미들웨어에서 가져와서 선언해줌
  res.locals.user = {
    isAuthenticated: true,
    id: 1,
  };
  next(); // 미들웨어는 끝나면 항상 next()를 써줘야 다음 함수나 동작으로 넘어간다. (필수)
};
