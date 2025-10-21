// Sean
import Path from "../Models/pathModel.js";
import cusError from "../utils/cusError.js";
import catchAsync from "../utils/catchAsync.js";
import Review from "../Models/reviewModel.js";
import { updateOne, getOne, getAll, deleteOne, createOne } from "./centralController.js";

export const test = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findOne({
      path: req.params.pathId,
      user: req.params.userId,
    });

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new cusError("No review found for this path & user", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getOnePath = getOne(Path);
export const createOneReview = createOne(Review);
export const getAllReview = getAll(Review);
export const getOneReview = getOne(Review);
export const getOneByPathAndUser = test(Review);
export const patchOneReview = updateOne(Review);
export const deleteOneReview = deleteOne(Review);
