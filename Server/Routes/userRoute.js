import express from "express";

import { protect, restrictTo, login, signup, updatePasswordLogic  } from "../Controllers/authController.js";
import { addToUserList, removeFromUserList } from "../Controllers/favListController.js";
import { getMe, updateCurrentUser, checkEmail, getAllUsers,updateUserPhoto ,updateAnyUser} from "../Controllers/userController.js";
import { uploadUserPhoto,deleteUser } from "../Controllers/userController.js";

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
userRoute.route("/update-password").patch(protect, updatePasswordLogic);

userRoute
  .route("/list")
  .patch(protect, addToUserList)
  .delete(protect, removeFromUserList);
userRoute.route("/admin").get(protect, restrictTo("admin"), getAllUsers);
userRoute
  .route("/admin/:id")
  .patch(protect, restrictTo("admin"), updateAnyUser)
  .delete(protect, restrictTo("admin"), deleteUser);
export default userRoute;
