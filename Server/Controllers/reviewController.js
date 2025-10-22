// Sean
import sanitizeHtml from "sanitize-html";
import Path from "../Models/pathModel.js";
import cusError from "../utils/cusError.js";
import catchAsync from "../utils/catchAsync.js";
import Review from "../Models/reviewModel.js";
import { updateOne, getOne, getAll, deleteOne, createOne } from "./centralController.js";

export const test = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findOne({
        path: req.params.pathId,
        user: req.params.userId,
    });

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
        return next(new cusError("No review found for this path & user", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            data: doc,
        },
    });
});

function isInjected(input) {
    const sanitized = sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: {},
    });

    return sanitized !== input;
}

const createSingleReview = (Model) =>
catchAsync(async (req, res, next) => {
    if (Model.modelName === "Review" && !isInjected(req.body.review)) {
        const doc = await Model.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                data: doc,
            },
        });
    } else {
        next(new cusError("Injection Detected", 403))
    }
});

export const getOnePath = getOne(Path);
export const createOneReview = createSingleReview(Review);
export const getAllReview = getAll(Review);
export const getOneReview = getOne(Review);
export const getOneByPathAndUser = test(Review);
export const patchOneReview = updateOne(Review);
export const deleteOneReview = deleteOne(Review);
