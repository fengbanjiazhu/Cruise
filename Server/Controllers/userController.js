import User from "../Models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import { updateOne, getOne, getAll, deleteOne } from "./centralController.js";

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);

export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("savedList");

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

export const updateCurrentUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) return next(new cusError("No user found", 404));

  res.status(200).json({
    status: "success",
    data: { data: doc },
  });
});

