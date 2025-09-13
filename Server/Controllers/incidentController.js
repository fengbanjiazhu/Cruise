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
