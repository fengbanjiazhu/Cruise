import Path from "../Models/pathModel.js";
import Review from "../Models/reviewModel.js";
import {
  updateOne,
  getOne,
  getAll,
  deleteOne,
  createOne,
} from "./centralController.js";

export const getOnePath = getOne(Path);
export const createOneReview = createOne(Review);
export const getAllReview = getAll(Review);
