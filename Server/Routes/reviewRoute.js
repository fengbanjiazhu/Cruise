import express from "express";
import { getOneReview, createOneReview, getAllReview } from "../Controllers/reviewController.js";

const reviewRoute = express.Router();

reviewRoute.route("/:pathId").get(getAllReview);
reviewRoute.route("/userReview/:id").get(getOneReview);
reviewRoute.route("/CreateReview").post(createOneReview);
export default reviewRoute;
