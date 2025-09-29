import express from "express";

import { protect, restrictTo, login, signup, updatePassword } from "../Controllers/authController.js";
import { addToUserList, removeFromUserList } from "../Controllers/favListController.js";
import { getMe, updateCurrentUser, checkEmail, getAllUsers,updateUserPhoto } from "../Controllers/userController.js";
import { uploadUserPhoto } from "../Controllers/userController.js";

const userRoute = express.Router();

userRoute.route("/").get(protect, getMe);
// .post(signup).patch(protect, updateUser);

userRoute.route("/login").post(login);
userRoute.route("/register").post(signup);

userRoute.route("/update").patch(protect, updateCurrentUser);
userRoute
  .route("/update-photo")
  .patch(protect, uploadUserPhoto, updateUserPhoto);

userRoute.route("/checkEmail").get(checkEmail);
userRoute.route("/update-password").patch(protect, updatePassword);

userRoute
  .route("/list")
  .patch(protect, addToUserList)
  .delete(protect, removeFromUserList);
userRoute.route("/admin").get(protect, restrictTo("admin"), getAllUsers);

export default userRoute;
