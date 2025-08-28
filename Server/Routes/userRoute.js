import express from "express";
// import { protect, restrictTo, login, signup } from "../Controllers/authController.js";
import { login } from "../Controllers/authController.js";

const userRoute = express.Router();

// userRoute
//   .route("/")
//   .post(signup)
//   .get(protect, restrictTo("admin"), getAllUser)
//   .patch(protect, updateUser);

userRoute.route("/login").post(login);

export default userRoute;
