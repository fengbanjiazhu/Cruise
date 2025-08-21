const mongoose = require("mongoose");
const Tour = require("./pathModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, "Review can not be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    path: {
      type: mongoose.Schema.ObjectId,
      ref: "Path",
      require: [true, "A review must belong to a path"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: [true, "A review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ path: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// Do the calculating later

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
