// Jeffrey
import catchAsync from "../utils/catchAsync.js";
import User from "../Models/userModel.js";
import cusError from "../utils/cusError.js";

const handleList = async function (userid, path_id, action, next) {
  if (!path_id) {
    return next(new cusError("Missing path id", 400));
  }

  const update =
    action === "add" ? { $addToSet: { savedList: path_id } } : { $pull: { savedList: path_id } };

  const updatedUser = await User.findByIdAndUpdate(userid, update, { new: true }).populate(
    "savedList"
  );

  console.log(`Action Result: ${updatedUser}`);

  return updatedUser;
};

export const addToUserList = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { pathid } = req.body;

  const updatedUser = await handleList(_id, pathid, "add", next);

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

export const removeFromUserList = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { pathid } = req.body;

  const updatedUser = await handleList(_id, pathid, "remove", next);

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});
