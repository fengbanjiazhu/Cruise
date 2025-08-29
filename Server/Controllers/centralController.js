import catchAsync from "../utils/catchAsync.js";
import cusError from "../utils/cusError.js";
import QueryFeatures from "../utils/queryFeatures.js";

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new cusError("No data found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new cusError("No data found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // --- Custom validation logic ---
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
    // --- End validation logic ---

    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new cusError("No data found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.pathId) filter = { path: req.params.pathId };

    const features = new QueryFeatures(Model.find(filter), req.query).filter().sort().limitFields();
    let doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
