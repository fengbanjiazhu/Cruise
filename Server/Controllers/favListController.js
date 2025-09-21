import User from "../Models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import { updateOne, getOne, getAll, deleteOne } from "./centralController.js";

export const addToUserList = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  //   const user = await User.findById(_id).populate("favList");

  const list = user.favList;

  res.status(200).json({
    status: "success",
    data: {
      list,
    },
  });
});
