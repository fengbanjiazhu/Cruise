import express from "express";
import { patchOneReview, createOneReview, getAllReview, getOneByPathAndUser, deleteOneReview } from "../Controllers/reviewController.js";

const reviewRoute = express.Router();



reviewRoute.route("/:pathId").get(getAllReview);
reviewRoute.route("/:pathId/user/:userId").get(getOneByPathAndUser);
reviewRoute.route("/CreateReview").post(createOneReview);
reviewRoute.route("/:id").patch(patchOneReview);
reviewRoute.route("/:id").delete(deleteOneReview);

export default reviewRoute;
