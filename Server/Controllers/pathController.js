import Path from "../Models/pathModel.js";
import { updateOne, getOne, getAll, deleteOne, createOne } from "./centralController.js";

// Existing create
// export const createOnePath = createOne(Path);
export const createOnePath = async (req, res, next) => {
  const errors = [];
  const { name, locations, profile, waypoints, distance, duration } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 8) {
    errors.push("Name is required and must be at least 8 characters.");
  }
  if (!Array.isArray(locations) || locations.length < 2) {
    errors.push("At least 2 locations are required.");
  }
  if (!profile || !["car", "bike", "foot"].includes(profile)) {
    errors.push("Profile must be one of: car, bike, foot.");
  }
  if (!Array.isArray(waypoints) || waypoints.length < 2) {
    errors.push("At least 2 waypoints are required.");
  }
  if (typeof distance !== "number" || distance <= 0) {
    errors.push("Distance must be a positive number.");
  }
  if (typeof duration !== "number" || duration <= 0) {
    errors.push("Duration must be a positive number.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: "fail",
      errors,
    });
  }

  try {
    const doc = await Path.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getOnePath = getOne(Path);
export const getAllPaths = getAll(Path);


