import express from "express";
import {
  getOnePath,
  createOneIncident,
  getAllIncidents,
} from "../Controllers/incidentController.js";

const incidentRoute = express.Router();

incidentRoute.route("/:id").get(getAllIncidents);
incidentRoute.route("/CreateIncident").post(createOneIncident);
export default incidentRoute;
