// routes/incidentRoute.js
import express from "express";
import {
  listIncidents,
  getIncident,
  createIncident,
  updateIncident,
} from "../Controllers/incidentController.js";

const router = express.Router();

router.get("/", listIncidents); // GET /incidents?status=open&severity=high
router.post("/", createIncident); // POST /incidents
router.get("/:id", getIncident); // GET /incidents/INC-2403
router.patch("/:id", updateIncident); // PATCH /incidents/INC-2403

export default router;
