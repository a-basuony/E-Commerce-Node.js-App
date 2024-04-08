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

/**
 * @desc  Update a Subcategory
 * @route PUT /api/subcategories/:id
 * @access Private
 */
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id }, // find the document with this ID
    { name, slug: slugify(name), category }, // update it with new values,
    { new: true } // and then return the updated document
  );

  if (!subCategory) {
    return next(
      new ApiError(`Couldn't find this subCategory with this id ${id}`, 404)
    );
  }
  res.status(200).json({ data: subCategory });
});

/**
 * @desc     Delete subCategory with id
 * @route    DELETE  api/v1/subcategories
 * @access   Private
 */
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await SubCategory.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError("SubCategory not found", 404));
  }
  res.status(204).send();
});
