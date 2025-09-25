class QueryFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludeFields = ["sort", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    const mongoQuery = {};

    for (const [key, value] of Object.entries(queryObj)) {
      if (["lat", "lng", "radius"].includes(key)) continue;

      const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);
      if (match) {
        const field = match[1];
        const op = `$${match[2]}`;
        if (!mongoQuery[field]) mongoQuery[field] = {};
        mongoQuery[field][op] = Number(value);
      } else if (typeof value === "string") {
        mongoQuery[key] = { $regex: value, $options: "i" };
      } else {
        mongoQuery[key] = value;
      }
    }

    if (queryObj.lat && queryObj.lng && queryObj.radius) {
      const lat = parseFloat(queryObj.lat);
      const lng = parseFloat(queryObj.lng);
      const radius = parseFloat(queryObj.radius) / 6378.1;

      mongoQuery.startLocation = {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius],
        },
      };
    }

    console.log(mongoQuery);

    console.log("CONDITIONS:", mongoQuery._conditions);

    // this.query = this.query.find(mongoQuery);
    this.query = this.query.model.find(mongoQuery);

    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt _id");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__V");
    }
    return this;
  }
}

export default QueryFeatures;
