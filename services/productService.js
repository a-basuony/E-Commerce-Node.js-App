const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Product = require("../models/productModel");

const ApiError = require("../utils/apiError");

/**
 * @desc  Get all products
 * @route GET /api/v1/products
 * @access Public
 */
exports.getProducts = asyncHandler(async (req, res, next) => {
  // 1) filtering
  const queryStringObj = { ...req.query };
  const excludesFields = ["page", "sort", "limit", "fields"];
  excludesFields.forEach((field) => delete queryStringObj[field]);

  //apply filtration using [gte, gt, lte, lt]
  let queryString = JSON.stringify(queryStringObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  const query = JSON.parse(queryString);

  // we need like this { price: { $gt: '109.95' }, ratingsAverage: { $gt: '4.3' } }
  // 2) pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  // 3) Build query // to can chain methods on the query
  let mongooseQuery = Product.find(query)
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });

  // 4) Sorting(one or list or nothing)
  if (req.query.sort) {
    // convert from 'price, average' => 'price average'
    // 'price, average' split(',') => ['price', 'average'] join(' ') => 'price average'
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("-createdAt");
  }

  // 5) fields limitations
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  }

  // 6) Search (title, description)
  try {
    if (req.query.keyword) {
      // const query = {
      //   $or: [
      //     { title: { $regex: req.query.keyword, $options: "i" } },
      //     { description: { $regex: req.query.keyword, $options: "i" } },
      //   ],
      // };
      const keywordRegex = new RegExp(req.query.keyword, "i");
      const query = {
        $or: [
          { title: { $regex: keywordRegex } },
          { description: { $regex: keywordRegex } },
        ],
      };
      mongooseQuery = mongooseQuery.find(query);
    }
  } catch (err) {
    return next(new ApiError("Invalid search query", 400));
  }

  // 4) Execute query
  try {
    const products = await mongooseQuery;

    if (products.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No products found",
      });
    }
    if (!products) {
      return next(new ApiError("Products not found", 404));
    }

    res.status(200).json({
      status: "success",
      results: products.length,
      page,
      data: products,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * @desc  Get single product
 * @route GET /api/v1/products/:id
 * @access Public
 */
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name",
  });
  if (!product) {
    return next(new ApiError(`there is no product for this id: ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

/**
 * @desc   Create a new product
 * @route  POST /api/v1/products
 * @access Private
 */
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);

  const product = await Product.create(req.body);
  if (!product) {
    return next(new ApiError("Failed to create product", 400));
  }
  res.status(201).json({ data: product });
});

/**
 * @desc Update a product with id
 * @route PUT /api/v1/products/:id
 * @access Private
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  }).populate({
    path: "category",
    select: "name",
  });
  if (!product) {
    return next(
      new ApiError(`failed to update product for this id: ${id}`, 400)
    );
  }
  res.status(200).json({ data: product });
});

/**
 * @desc     Delete a product
 * @route    DELETE /api/v1/products/:id
 * @access   Private
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(
      new ApiError(`failed to delete product for this id: ${id}`, 404)
    );
  }
  res.status(200).json({ message: "Deleted product successfully" });
});
