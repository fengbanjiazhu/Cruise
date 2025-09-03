import express from "express";
import { protect, restrictTo, login ,signup} from "../Controllers/authController.js";
import { getMe,updateUser,checkEmail } from "../Controllers/userController.js";

const userRoute = express.Router();

userRoute.route("/").get(protect, getMe);
// .post(signup).patch(protect, updateUser);

userRoute.route("/login").post(login);
userRoute.route("/register").post(signup);
// userRoute.route("/all").get(protect, restrictTo("admin"),getAllUser);
userRoute.route("/checkEmail").get(checkEmail);
export default userRoute;
