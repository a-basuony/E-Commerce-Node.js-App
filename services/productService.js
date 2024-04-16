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

  // 2) pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  // 3) Build query
  const mongooseQuery = Product.find(queryStringObj)
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });

  // 4) Execute query
  const products = await mongooseQuery;

  if (!products) {
    return next(new ApiError("Products not found", 404));
  }
  res.status(200).json({ results: products.length, page, data: products });
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
