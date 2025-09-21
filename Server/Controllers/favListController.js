import catchAsync from "../utils/catchAsync.js";
import { updateOne, getOne, getAll, deleteOne } from "./centralController.js";
import User from "../Models/userModel.js";

export const addToUserList = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const current_user = await User.findById(_id).populate("favList");

  const list = current_user.favList;

  res.status(200).json({
    status: "success",
    data: {
      list,
    },
  });
});
