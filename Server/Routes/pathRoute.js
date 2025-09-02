import express from "express";
import { createOnePath, getOnePath } from "../Controllers/pathController.js";

const pathRoute = express.Router();

pathRoute.route("/").post(createOnePath);
pathRoute.route("/:id").get(getOnePath);


export default pathRoute;
