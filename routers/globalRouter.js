import express from "express";
import { home, search } from "../controllers/videoController";
import { getJoin, postJoin, getLogin, postLogin, logout } from "../controllers/userController";
import { onlyPublic } from "../middlewares";
import routes from "../routes";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin); // postJoin에서 받은 정보를 postLogin으로 넘겨줌(postJoin함수는 여기서 미들웨어 역할을 함)

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.logout, onlyPublic, logout);

export default globalRouter;
