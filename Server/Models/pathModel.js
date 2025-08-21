import mongoose from "mongoose";
import slugify from "slugify";
// const User = require('./userModel');

// create a new schema
// states out required or not, has default value or not, etc
const pathSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A path must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A path name must not more than 40 characters"],
      minlength: [10, "A path name must not less than 10 characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A path must have a duration"],
    },
    difficulty: {
      type: String,
      required: [true, "A path must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "difficulty is either: easy, medium, or difficult",
      },
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    creator: { type: mongoose.Schema.ObjectId, ref: "User" },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// pathSchema.index({ ratingsAverage: -1 });
// pathSchema.index({ slug: 1 });
// pathSchema.index({ startLocation: '2dsphere' });

// virtual populate
// pathSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'path',
//   localField: '_id',
// });

pathSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Path = mongoose.model("Path", pathSchema);

module.exports = Path;
