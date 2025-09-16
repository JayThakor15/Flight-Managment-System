import express from "express";
import userController from "./user.controller.js";
import uploadFile from "./fileupload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const userRouter = express.Router();
const userControllerr = new userController();

userRouter.post("/signup", uploadFile.single("ProImage"), (req, res, next) => {
  userControllerr.userSignup(req, res, next);
});
userRouter.post("/login", (req, res, next) => {
  userControllerr.login(req, res, next);
});

userRouter.get("/", authMiddleware, (req, res, next) => {
  userControllerr.getProfile(req, res, next);
});

userRouter.post(
  "/",
  authMiddleware,
  uploadFile.single("updateImage"),
  (req, res, next) => {
    userControllerr.updateProfile(req, res, next);
  }
);
export default userRouter;
