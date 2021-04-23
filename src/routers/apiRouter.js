import express from "express";
import { postCheckLogin } from "../controllers/userController";
import { postAddComment, postRegisterView } from "../controllers/videoController";
import routes from "../routes";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.post(routes.checkLogin, postCheckLogin);

export default apiRouter;
