import express from "express";
import passport from "passport";
import { home, search } from "../controllers/videoController";
import { getJoin, postJoin, getLogin, postLogin, logout, githubLogin, postGithubLogin, getMe, facebookLogin, postFacebookLogin } from "../controllers/userController";
import { onlyPublic, onlyPrivate } from "../middlewares";
import routes from "../routes";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin); // postJoin에서 받은 정보를 postLogin으로 넘겨줌(postJoin함수는 여기서 미들웨어 역할을 함)

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.logout, onlyPrivate, logout);

// github라우트로 들어왔을 때 githublogin을 실행함
globalRouter.get(routes.github, githubLogin);

// githubCallback라우트로 들어왔을 때 패스포트가 먼저 인증처리를 한 후, 실패시 /login라우트로 리다이텍트 보내고, 성공시 postGithubLogin함수를 실행함
globalRouter.get(routes.githubCallback, passport.authenticate("github", { failureRedirect: "/login" }), postGithubLogin);

globalRouter.get(routes.me, getMe);

globalRouter.get(routes.facebook, facebookLogin);
globalRouter.get(routes.facebookCallback, passport.authenticate("facebook", { failureRedirect: "/login" }), postFacebookLogin);
export default globalRouter;
