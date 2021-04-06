import express from "express";
import { userDetail, getEditProfile, postEditProfile, getChangePassword, postChangePassword } from "../controllers/userController";
import { onlyPrivate, uploadAvatar } from "../middlewares";
import routes from "../routes";

// express.Router(): 새로운 Router객체 생성
// express.Route를 이용하면 라우트들을 여러 개의 소그룹으로 나눌 수 있다.
const userRouter = express.Router();

// 새로운 Router객체를 생성하고 새로운 Router객체는 기존 라우트 경로에 추가됨.
// 예를들면 localhost:4000/users로 들어왔을 때 userRouter미들웨어가 실행되면 userRouter는 새로운 Router객체를 생성해서 localhost:4000/users 뒤에 /users등의 라우트를 추가한다.
userRouter.get(routes.editProfile, onlyPrivate, getEditProfile);
userRouter.post(routes.editProfile, onlyPrivate, uploadAvatar, postEditProfile);

userRouter.get(routes.changePassword, onlyPrivate, getChangePassword);
userRouter.post(routes.changePassword, onlyPrivate, postChangePassword);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
