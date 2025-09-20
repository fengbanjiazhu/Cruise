import express from "express";
import {
  createOnePath,
  getOnePath,
  getAllPaths,
} from "../Controllers/pathController.js";

const pathRoute = express.Router();

pathRoute.route("/").post(createOnePath).get(getAllPaths);
pathRoute.route("/:id").get(getOnePath);

export default pathRoute;
