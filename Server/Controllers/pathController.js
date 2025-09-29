import Path from "../Models/pathModel.js";
import {
  updateOne,
  getOne,
  getAll,
  deleteOne,
  createOne,
} from "./centralController.js";

// Existing create
// export const createOnePath = createOne(Path);
export const createOnePath = async (req, res, next) => {
  const errors = [];
  // Only allowing logged users to create paths
  const user = req.user;
  const {
    name,
    locations,
    profile,
    waypoints,
    distance,
    duration,
    description,
  } = req.body;

  // Validation from Mongoose Scheme has been updated, could be removed
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

  // Added filter to exclude unexpected data from body
  const path_filter = {
    name,
    locations,
    profile,
    waypoints,
    distance,
    duration,
    description,
    creator: user._id,
  };

  try {
    const doc = await Path.create(path_filter);
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

export const updateOnePath = async (req, res, next) => {
  const errors = [];
  const user = req.user;
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
    const pathDoc = await Path.findById(req.params.id);

    if (!pathDoc) {
      return res
        .status(404)
        .json({ status: "fail", message: "No data found with that ID" });
    }

    if (pathDoc.creator.toString() !== user._id.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "You are not allowed to update this path",
      });
    }

    const doc = await Path.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "No data found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message || "Update failed",
    });
  }
};

export const deleteOnePath = async (req, res, next) => {
  const user = req.user;

  try {
    const pathDoc = await Path.findById(req.params.id);

    if (!pathDoc) {
      return res
        .status(404)
        .json({ status: "fail", message: "Path not found" });
    }

    if (
      pathDoc.creator.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return res.status(403).json({
        status: "fail",
        message: "You are not allowed to delete this path",
      });
    }

    const doc = await Path.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "No path found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message || "Delete failed",
    });
  }
};

export const getAllPaths = async (req, res, next) => {
  try {
    console.log("Fetching all paths");
    // Fetch paths, excluding blocked ones, optionally include creator information
    const paths = await Path.find({ blocked: { $ne: true } }).populate({
      path: "creator",
      select: "name email",
    });

    console.log(`Found ${paths.length} active paths (blocked paths excluded)`);

    // Return with proper content type
    res.status(200).header("Content-Type", "application/json").json({
      status: "success",
      results: paths.length,
      data: paths,
    });
  } catch (err) {
    console.error("Error in getAllPaths:", err);
    next(err);
  }
};

export const getOnePath = getOne(Path);
