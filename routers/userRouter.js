import express from "express";

// express.Router(): router객체 생성
export const userRouter = express.Router(); 

// express.Router()를 통해 router객체를 생성한 후 그 router객체에게 각각의 라우트들을 준 것이다
// userRouter.get("/", (req,res) => res.send(`User home`));
// userRouter.get("/edit", (req,res) => res.send(`User edit`));
// userRouter.get("/password", (req,res) => res.send(`User password`));

export default userRouter;