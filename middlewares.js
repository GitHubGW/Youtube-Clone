import routes from "./routes";

// 로컬 변수를 전역 변수로 만들어주는 미들웨어 함수
export const localsMiddleware = (req, res, next) => {
  // console.log("localMiddleware 실행");
  res.locals.siteName = "Youtube";
  //routes.js를 템플릿 엔진(pug)에서 사용하기 위해 로컬 변수를 전역 변수로 만들어주는 미들웨어에서 가져와서 선언해줌
  res.locals.routes = routes;
  res.locals.user = {
    isAuthenticated: true,
    id: 1,
  };
  next();
};
