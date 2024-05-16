const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const Category = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

/**
// @desc     Get all categories
// @route    GET /api/v1/categories
// @access   Public
*/
const getCategories = asyncHandler(async (req, res, next) => {
  //Build Query
  const documentsCount = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(Category.find({}), req.query)
    .filter()
    .sort()
    // .search()
    .limitFields()
    .paginate(documentsCount);

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await mongooseQuery;

  res
    .status(200)
    .json({ results: categories.length, paginationResult, data: categories });
});

/**
 // @desc Get specific category by id
 // @route  GET /api/v1/categories/:id
 // @access Public
 */
const getCategoryById = factory.getOne(Category);

/**
 // @dec  create a new category
 // @route POST /api/v1/categories
 // @access Private      //=> (for admin only)
 */
const createCategory = factory.createOne(Category);

/** 
// @desc   Update specific category name by id
// @route  PUT /api/v1/categories/:id
// @access  Private     //=> Only the owner can update a category
*/
const updateCategory = factory.updateOne(Category);

/* 
//  @desc Delete a category from database by its id
//  @route DELETE /api/v1/categories/:id
//  @access Private
*/
const deleteCategory = factory.deleteOne(Category);

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
