// controllers/incidentController.js
import Incident from "../Models/incidentModel.js";
import Path from "../Models/pathModel.js";

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
    
    // If the incident is being approved and it targets a Path, delete the path
    if (req.body.status === "approved" && item.targetType === "Path") {
      try {
        const deletedPath = await Path.findByIdAndDelete(item.targetId);
        if (deletedPath) {
          console.log(`Path ${item.targetId} deleted due to approved incident ${item.id}`);
        } else {
          console.log(`Path ${item.targetId} not found for deletion`);
        }
      } catch (pathError) {
        console.error("Error deleting path:", pathError);
        // Don't fail the incident update if path deletion fails
      }
    }
    
    res.json(item);
  } catch (error) {
    console.error("Error updating incident:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteIncident = async (req, res) => {
  try {
    const result = await Incident.findOneAndDelete({ id: req.params.id });

    if (!result) {
      return res.status(404).json({ message: "Incident not found" });
    }

    console.log(`Deleted incident ${req.params.id}`);
    res.status(200).json({
      message: "Incident deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    console.error("Error deleting incident:", error);
    res.status(500).json({ message: error.message });
  }
};
