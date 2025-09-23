import User from "../Models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import { updateOne, getOne, getAll, deleteOne } from "./centralController.js";

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);

export const getMe = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const user = req.user;

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const checkEmail = catchAsync(async (req, res, next) => {
  const { email } = req.query;

  const user = await User.findOne({ email });

  res.status(200).json({
    exists: !!user, // true if user exists, false otherwise
  });
});
