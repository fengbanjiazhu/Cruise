import express from "express";
import { createOnePath, getOnePath, getAllPaths } from "../Controllers/pathController.js";

const pathRoute = express.Router();

pathRoute.route("/").get(getAllPaths).post(createOnePath);
pathRoute.route("/:id").get(getOnePath);


export default pathRoute;
