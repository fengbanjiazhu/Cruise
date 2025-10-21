import express from "express";

import {
  protect,
  restrictTo,
  login,
  signup,
  updatePassword,
} from "../Controllers/authController.js";
import { addToUserList, removeFromUserList } from "../Controllers/favListController.js";
import {
  getMe,
  updateCurrentUser,
  checkEmail,
  getAllUsers,
  updateAnyUser,
} from "../Controllers/userController.js";
import { deleteUser } from "../Controllers/userController.js";

const userRoute = express.Router();

userRoute.route("/").get(protect, getMe);
userRoute.route("/login").post(login);
userRoute.route("/register").post(signup);
userRoute.route("/checkEmail").get(checkEmail);

userRoute.route("/update").patch(protect, updateCurrentUser);
userRoute.route("/update-password").patch(protect, updatePassword);

userRoute.route("/list").patch(protect, addToUserList).delete(protect, removeFromUserList);
userRoute.route("/admin").get(protect, restrictTo("admin"), getAllUsers);
userRoute
  .route("/admin/:id")
  .patch(protect, restrictTo("admin"), updateAnyUser)
  .delete(protect, restrictTo("admin"), deleteUser);
export default userRoute;
