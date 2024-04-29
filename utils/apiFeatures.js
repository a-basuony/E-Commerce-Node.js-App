class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    // localhost:3000/api/v1/products?price[gte]=50&ratingsAverage[gte]=4
    // 1) filtering
    const queryStringObj = { ...this.queryString }; // {...req.query}
    const excludesFields = ["page", "sort", "limit", "fields"];
    excludesFields.forEach((field) => delete queryStringObj[field]); // delete page, sort, limit, fields from query

    // 2) advanced filtering

    //apply filtration using [gte, gt, lte, lt]
    let queryString = JSON.stringify(queryStringObj);
    queryString = queryString.replace(
      // MongoDB query operators ($gte, $gt, $lte, and $lt)
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const query = JSON.parse(queryString);
    this.mongooseQuery = this.mongooseQuery.find(query);

    return this;
  }
  // we return this (all object ) to chain all methods like apiFeature.filter().sort()

  sort() {
    if (this.queryString.sort) {
      // convert from 'price, average' => 'price average' => remove (,)
      // 'price, average' split(',') => ['price', 'average'] join(' ') => 'price average'
      const sortBy = this.queryString.sort.split(",").join(" ");
      console.log("sorted by" + sortBy);
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt"); // sort by createdAt in descending order
    }
    return this;
  }
  // we return this (all object ) to chain all methods like apiFeature.filter().sort()

  limitFields() {
    // fields limitations
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v"); // remove __v
    }
    return this;
  }

  search(modelName) {
    // Search in (title, description) or name
    let query = {};
    try {
      if (modelName === "Products") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: "i" } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    } catch (err) {
      return next(new ApiError("Invalid search query", 400));
    }

    return this;
  }

  paginate(countOfDocuments) {
    // 2) pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit; // 3 * 5 => 15 skip
    const endIndex = page * limit; // end index of the current page

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;

    pagination.numberOfPages = countOfDocuments / limit; // 50/10 => 5 pages
    pagination.countOfDocuments = countOfDocuments;

    if (endIndex < countOfDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.pagination = pagination;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
  populate(options) {
    this.mongooseQuery = this.mongooseQuery.populate(options);
    return this;
  }
}

module.exports = ApiFeatures;
