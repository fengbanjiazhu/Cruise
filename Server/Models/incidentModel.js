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
    targetId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "A report must reference a target item"],
    },
    targetType: {
      type: String,
      required: [true, "A report must specify a target type"],
      enum: ["Path", "Review"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: [true, "A report must belong to a user"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    handledBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

IncidentSchema.index({ status: 1, severity: 1 });

export default mongoose.model("Incident", IncidentSchema);
