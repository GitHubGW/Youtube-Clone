import express from "express";
import { users, userDetail, editProfile, changePassword } from "../controllers/userController";
import routes from "../routes";

// express.Router(): 새로운 Router객체 생성
const userRouter = express.Router();

// 새로운 Router객체를 생성하고 새로운 Router객체는 기존 라우트 경로에 추가됨.
// 예를들면 localhost:4000/users로 들어왔을 때 userRouter미들웨어가 실행되면 userRouter는 새로운 Router객체를 생성해서 localhost:4000/users 뒤에 /users등의 라우트를 추가한다.
userRouter.get(routes.editProfile, editProfile);
userRouter.get(routes.changePassword, changePassword);
userRouter.get(routes.userDetail, userDetail);

export default userRouter;
