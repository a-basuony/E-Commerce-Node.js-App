const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Brand = require("../models/brandModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

/**
 * @desc   Gets list of brands
 * @route  GET /api/v1/brands
 * @access Public
 */
exports.getBrands = asyncHandler(async (req, res, next) => {
  //Build Query
  const documentsCount = await Brand.countDocuments();
  const apiFeatures = new ApiFeatures(Brand.find({}), req.query)
    .filter()
    .sort()
    .search()
    .limitFields()
    .paginate(documentsCount);

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const brands = await mongooseQuery;

  res
    .status(200)
    .json({ results: brands.length, paginationResult, data: brands });
});

/**
 * @desc   Create brand
 * @route  POST /api/v1/brands
 * @access Private
 */
exports.createBrand = factory.createOne(Brand);

/**
 * @desc   Get specific brand
 * @route  GET /api/v1/brands/:id
 * @access Public
 */
exports.getSpecificBrand = factory.getOne(Brand);

// exports.getSpecificBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const brand = await Brand.findById(id);
//   if (!brand) {
//     return next(new ApiError(`Not found for this id: ${id}`, 404));
//   }
//   res.status(200).json({ data: brand });
// });

/**
 * @desc  Update a brand
 * @route PUT /api/v1/brands
 * @access Private
 */
exports.updateBrand = factory.updateOne(Brand);

/**
 * @desc Delete a specific brand
 * @route DELETE /api/v1/brands
 * @access Private
 */
exports.deleteBrand = factory.deleteOne(Brand);
