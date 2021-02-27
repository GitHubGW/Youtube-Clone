import routes from "./routes";

// 로컬 변수를 전역 변수로 만들어주는 미들웨어 함수
export const localsMiddleware = (req, res, next) => {
  console.log("localMiddleware 실행");
  res.locals.siteName = "Youtube";
  res.locals.routes = routes;
  next();
};
