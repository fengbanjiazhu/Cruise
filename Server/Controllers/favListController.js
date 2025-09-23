import catchAsync from "../utils/catchAsync.js";
import { updateOne, getOne, getAll, deleteOne } from "./centralController.js";
import User from "../Models/userModel.js";

export const addToUserList = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { pathid } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { $addToSet: { savedList: pathid } },
    { new: true }
  ).populate("savedList");

  console.log(`Add Result: ${updatedUser}`);

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

export const removeFromUserList = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { pathid } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { $pull: { savedList: pathid } },
    { new: true }
  ).populate("savedList");

  console.log(`Delete Result: ${updatedUser}`);

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});
