// routes/incidentRoute.js
import express from "express";
import {
  listIncidents,
  getIncident,
  createIncident,
  updateIncident,
  deleteIncident,
} from "../Controllers/incidentController.js";

const router = express.Router();

router.get("/", listIncidents);
router.post("/", createIncident);
router.get("/:id", getIncident);
router.patch("/:id", updateIncident);
router.delete("/:id", deleteIncident);

export default router;
