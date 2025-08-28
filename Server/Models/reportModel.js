import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      require: [true, "Report must have a comment"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
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
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reportSchema.pre("validate", function (next) {
  if (this.status !== "pending" && !this.handledBy) {
    this.invalidate("handledBy", "A handled report must have a handler");
  }
  next();
});

reportSchema.virtual("target", {
  ref: (doc) => doc.targetType,
  localField: "targetId",
  foreignField: "_id",
  justOne: true,
});

// reportSchema.index({ path: 1, user: 1 }, { unique: true });

const Report = mongoose.model("Report", reportSchema);

export default Report;
