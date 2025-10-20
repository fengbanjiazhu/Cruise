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
    const processedKeys = new Set();

    for (const [key, value] of Object.entries(queryObj)) {
      if (["lat", "lng", "radius"].includes(key)) continue;

      if (typeof value === "object" && value !== null) {
        mongoQuery[key] = {};
        for (const [innerKey, innerValue] of Object.entries(value)) {
          const op = ["gte", "gt", "lte", "lt"].includes(innerKey) ? `$${innerKey}` : innerKey;
          mongoQuery[key][op] = Number(innerValue);
        }
        processedKeys.add(key);
      } else if (typeof value === "string") {
        mongoQuery[key] = { $regex: value, $options: "i" };
      } else {
        mongoQuery[key] = value;
      }
    }

    if (queryObj.lat && queryObj.lng && queryObj.radius) {
      ["lat", "lng", "radius"].forEach((k) => processedKeys.add(k));

      const [lat, lng, radius] = [
        parseFloat(queryObj.lat),
        parseFloat(queryObj.lng),
        parseFloat(queryObj.radius) / 6378.1,
      ];

      mongoQuery.startLocation = {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius],
        },
      };
    }

    for (const k of processedKeys) {
      delete this.query._conditions[k];
    }

    this.query = this.query.find(mongoQuery);
    // console.log("QUERY NOW:", this.query._conditions);

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
