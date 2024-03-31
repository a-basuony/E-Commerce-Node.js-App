const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const Category = require("../models/categoryModel");
/**
// @desc     Get all categories
// @route    GET /api/v1/categories
// @access   Public
*/
const getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit; /// ex: (2-1)*5=5

  // console.log(page, limit, skip);
  const categories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

/**
 // @desc Get specific category by id
 // @route  GET /api/v1/categories/:id
 // @access Public
 */
const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    res.status(404).json({ message: `No category for this id ${id}` });
  }
  res.status(200).json({ data: category });
});

/**
 // @dec  Get list of categories
 // @route POST /api/v1/categories
 // @access Private      //=> (for admin only)
 */
const createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await Category.create({
    name: name,
    slug: slugify(name),
  });
  res.status(201).json({ data: category });
});

// @desc   Update specific category name by id
// @route  PUT /api/v1/categories/:id
// @access  Private     //=> Only the owner can update a category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findOneAndUpdate(
    { _id: id }, // find the document with this ID
    { name, slug: slugify(name) }, // update it with new values,
    { new: true } // and then return the updated document
  );
  if (!category) {
    res.status(404).json({ message: `No category for this id ${id}` });
  }
  res.status(200).json({ data: category });
});

//  @desc Delete a category from database by its id
//  @route DELETE /api/v1/categories/:id
//  @access Private
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    res.status(404).json({ message: `No category for this id ${id}` });
  }
  res.status(204).send();
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
