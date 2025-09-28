import mongoose from "mongoose";
import slugify from "slugify";
// import validator from "validator";

const pathSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A path must have a name"],
      trim: true,
      maxlength: [40, "A path name must not more than 40 characters"],
      minlength: [8, "A path name must not less than 10 characters"],
    },
    slug: String,
    distance: {
      type: Number,
      required: [true, "A path must have a total distance"],
    },
    duration: {
      type: Number,
      required: [true, "A path must have a duration"],
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
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
    },
    profile: {
      type: String,
      enum: ["car", "bike", "foot"],
      required: true,
    },
    locations: {
      type: [
        {
          lat: { type: Number, required: true },
          lng: { type: Number, required: true },
        },
      ],
      required: true,
      validate: (v) => v.length > 0,
    },
    waypoints: {
      type: [
        {
          label: { type: String, required: true },
          lat: { type: Number, required: true },
          lng: { type: Number, required: true },
        },
      ],
      required: true,
      validate: (v) => v.length > 0,
    },
    creator: { type: mongoose.Schema.ObjectId, ref: "User" },
    blocked: {
      type: Boolean,
      default: false,
      select: false,
    },
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

pathSchema.pre(/^find/, function (next) {
  this.find({ blocked: { $ne: "true" } });
  next();
});

pathSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

pathSchema.pre("save", function (next) {
  if (this.locations && this.locations.length > 0) {
    const loc = this.locations[0];
    if (loc.lat != null && loc.lng != null) {
      this.startLocation.type = "Point";
      this.startLocation.coordinates = [loc.lng, loc.lat];
    }
  }

  next();
});

const Path = mongoose.model("Path", pathSchema);

export default Path;
