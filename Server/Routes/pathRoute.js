import express from "express";
import { createOnePath, getOnePath, getAllPaths, updateOnePath, deleteOnePath } from "../Controllers/pathController.js";

const pathRoute = express.Router();

pathRoute.route("/").get(getAllPaths).post(createOnePath);
pathRoute.route("/:id").get(getOnePath).patch(updateOnePath).delete(deleteOnePath);


export default pathRoute;