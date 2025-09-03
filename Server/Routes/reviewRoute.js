import express from "express";
import { getOnePath, createOneReview, getAllReview } from "../Controllers/reviewController.js";

const reviewRoute = express.Router();

reviewRoute.route("/:id").get(getAllReview);
reviewRoute.route("/CreateReview").post(createOneReview);
export default reviewRoute;
