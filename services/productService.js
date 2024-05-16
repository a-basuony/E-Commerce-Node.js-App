const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

/**
 * @desc  Get all products
 * @route GET /api/v1/products
 * @access Public
 */
exports.getProducts = asyncHandler(async (req, res, next) => {
  const countOfDocuments = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .paginate(countOfDocuments)
    .filter()
    .search("Products")
    .limitFields()
    .sort();
  // .populate({ path: "category", select: "" });

  try {
    const { mongooseQuery, paginationResult } = apiFeatures;
    const products = await mongooseQuery;

    if (!products || products.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No products found",
      });
    }

    res.status(200).json({
      status: "success",
      paginationResult,
      results: products.length,
      data: products,
    });
  } catch (err) {
    // next(err);
    console.log(err);
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
exports.createProduct = factory.createOne(Product);

// exports.createProduct = asyncHandler(async (req, res, next) => {
//   req.body.slug = slugify(req.body.title);

//   const product = await Product.create(req.body);
//   if (!product) {
//     return next(new ApiError("Failed to create product", 400));
//   }
//   res.status(201).json({ data: product });
// });

/**
 * @desc Update a product with id
 * @route PUT /api/v1/products/:id
 * @access Private
 */

exports.updateProduct = factory.updateOne(Product);

/**
 * @desc     Delete a product
 * @route    DELETE /api/v1/products/:id
 * @access   Private
 */
exports.deleteProduct = factory.deleteOne(Product);
