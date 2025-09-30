import User from "../Models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import { updateOne, getOne, getAll, deleteOne } from "./centralController.js";
import multer from "multer";
import cusError from "../utils/cusError.js";

// export const getAllUsers = getAll(User);

export const getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.findAllIncludingInactive();
  res.status(200).json({
    status: "success",
    results: allUsers.length,
    data: allUsers,
  });
});
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

export const updateUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new cusError("No file uploaded", 400));

  const doc = await User.findByIdAndUpdate(
    req.user._id,
    { photo: req.file.filename },
    { new: true, runValidators: true }
  );

  if (!doc) return next(new cusError("No user found", 404));

  res.status(200).json({
    status: "success",
    data: { data: doc },
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
  },
});

export const uploadUserPhoto = multer({ storage }).single("photo");


export const updateAnyUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log("Backend received ID:", id);
  console.log("Body:", req.body);

  if (req.body.active !== undefined) {
    req.body.active = Boolean(req.body.active);
  }

  const doc = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).select("+active");

  if (!doc) return next(new cusError("No user found", 404));

  res.status(200).json({
    status: "success",
    data: { data: doc },
  });
});
