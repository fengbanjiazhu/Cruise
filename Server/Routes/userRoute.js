import express from "express";
import { protect, restrictTo, login, signup } from "../Controllers/authController.js";
import { addToUserList, removeFromUserList } from "../Controllers/favListController.js";
import { getMe, updateCurrentUser, checkEmail, getAllUsers } from "../Controllers/userController.js";

const userRoute = express.Router();

userRoute.route("/").get(protect, getMe);
// .post(signup).patch(protect, updateUser);

userRoute.route("/login").post(login);
userRoute.route("/register").post(signup);
// userRoute.route("/all").get(protect, restrictTo("admin"),getAllUser);
userRoute.route("/update").patch(protect, updateCurrentUser);


userRoute.route("/checkEmail").get(checkEmail);

userRoute.route("/list").patch(protect, addToUserList).delete(protect, removeFromUserList);
userRoute.route("/admin").get(protect, getAllUsers);

export default userRoute;
