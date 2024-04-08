const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const SubCategory = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");

/**
 * @desc     Get all SubCategories
 * @route    GET /api/v1/Subcategories
 * @access   Public
 */
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;

  const subCategory = await SubCategory.find({}).skip(skip).limit(limit);
  if (!subCategory) {
    next(new ApiError("Failed to get Subcategories", 400));
  }
  res
    .status(200)
    .json({ results: subCategory.length, page, data: subCategory });
});

/**
 * @desc     Get specific SubCategory by id
 * @route    GET /api/v1/subCategory/:id
 * @access   Public
 */
exports.getSpecificSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    next(new ApiError(`No subCategory for this this id: ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

/**
 * @desc     Create SubCategory
 * @route    POST /api/v1/Subcategories
 * @access   Private
 */

exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name: name,
    slug: slugify(name),
    category, //  as a body it will be added as a subcategory of the provided category
  });

  if (!subCategory) {
    throw new ApiError("Failed to create Subcategory", 400);
  }
  res.status(201).json({ data: subCategory });
});
