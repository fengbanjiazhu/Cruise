import express from "express";
// import { protect, restrictTo, login, signup } from "../Controllers/authController.js";
import { login, protect } from "../Controllers/authController.js";
import { getMe } from "../Controllers/userController.js";

const userRoute = express.Router();

userRoute.route("/").get(protect, getMe);
//   .post(signup)
//   .patch(protect, updateUser);

userRoute.route("/login").post(login);
// userRoute.route("/all").get(protect, restrictTo("admin"),getAllUser);

export default userRoute;
