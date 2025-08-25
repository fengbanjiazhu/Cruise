import express from "express";
import { createOnePath } from "../Controllers/pathController.js";

const pathRoute = express.Router();

pathRoute.route("/").post(createOnePath);

export default pathRoute;
