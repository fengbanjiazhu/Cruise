import express from "express";
import {
  createOnePath,
  getOnePath,
  getAllPaths,
  updateOnePath,
  deleteOnePath,
} from "../Controllers/pathController.js";
import { protect } from "../Controllers/authController.js";

const pathRoute = express.Router();

pathRoute.route("/").get(getAllPaths).post(createOnePath);
pathRoute
  .route("/:id")
  .get(getOnePath)
  .patch(protect, updateOnePath)
  .delete(protect, deleteOnePath);

export default pathRoute;
