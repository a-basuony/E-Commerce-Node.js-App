const Product = require("../models/productModel");
const factory = require("./handlersFactory");

/**
 * @desc  Get all products
 * @route GET /api/v1/products
 * @access Public
 */
exports.getProducts = factory.getAll(Product, "Products");
// exports.getProducts = asyncHandler(async (req, res, next) => {
//   const countOfDocuments = await Product.countDocuments();

//   const apiFeatures = new ApiFeatures(Product.find(), req.query)
//     .paginate(countOfDocuments)
//     .filter()
//     .search("Products")
//     .limitFields()
//     .sort();
//   // .populate({ path: "category", select: "" });

//   try {
//     const { mongooseQuery, paginationResult } = apiFeatures;
//     const products = await mongooseQuery;

//     if (!products || products.length === 0) {
//       return res.status(404).json({
//         status: "fail",
//         message: "No products found",
//       });
//     }

//     res.status(200).json({
//       status: "success",
//       paginationResult,
//       results: products.length,
//       data: products,
//     });
//   } catch (err) {
//     // next(err);
//     console.log(err);
//   }
// });

/**
 * @desc  Get specific product
 * @route GET /api/v1/products/:id
 * @access Public
 */
exports.getProduct = factory.getOne(Product);

/**
 * @desc   Create a new product
 * @route  POST /api/v1/products
 * @access Private
 */
exports.createProduct = factory.createOne(Product);

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
