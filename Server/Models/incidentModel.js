// models/incidentModel.js
import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // "INC-2401"
    title: { type: String, required: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    assignee: { type: String, default: "Unassigned" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

IncidentSchema.index({ id: 1 });
IncidentSchema.index({ status: 1, severity: 1 });

export default mongoose.model("Incident", IncidentSchema);
