// controllers/incidentController.js
import Incident from "../Models/incidentModel.js";

export const listIncidents = async (req, res) => {
  try {
    const { status, severity } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    const items = await Incident.find(filter).sort({ updatedAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Error listing incidents:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getIncident = async (req, res) => {
  try {
    const item = await Incident.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (error) {
    console.error("Error getting incident:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createIncident = async (req, res) => {
  try {
    const item = await Incident.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating incident:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateIncident = async (req, res) => {
  try {
    const item = await Incident.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (error) {
    console.error("Error updating incident:", error);
    res.status(500).json({ message: error.message });
  }
};
