import express from "express";
import routes from "../routes";

// express.Router(): router객체 생성
const userRouter = express.Router(); 

userRouter.get(routes.users, (req, res) => res.send("User page"));
userRouter.get(routes.userDetail, (req, res) => res.send("UserDetail page"));
userRouter.get(routes.editProfile, (req, res) => res.send("EditProfile page"));
userRouter.get(routes.changePassword, (req, res) => res.send("ChangePassword page"));

export default userRouter;