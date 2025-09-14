import express from "express";
import {
  protect,
  restrictTo,
  login,
  signup,
} from "../Controllers/authController.js";
import {
  getMe,
  updateUser,
  checkEmail,
  getAllUsers,
} from "../Controllers/userController.js";

const userRoute = express.Router();

userRoute.route("/").get(protect, getMe);
// .post(signup).patch(protect, updateUser);

userRoute.route("/login").post(login);
userRoute.route("/register").post(signup);
// userRoute.route("/all").get(protect, restrictTo("admin"),getAllUser);
userRoute.route("/checkEmail").get(checkEmail);

// Remove role restriction but keep authentication
userRoute.route("/admin").get(protect, getAllUsers); // Any authenticated user can access

export default userRoute;
