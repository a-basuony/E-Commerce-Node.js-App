const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// upload single image using multer middleware to upload image accept filed name "image"
const uploadCategoryImage = uploadSingleImage("image");
// image processing
const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${filename}`);
  // save image into our db
  req.body.image = filename;

  next();
});

/**
// @desc     Get all categories
// @route    GET /api/v1/categories
// @access   Public
*/
const getCategories = factory.getAll(Category);

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

/**  
//  @desc Delete a category from database by its id
//  @route DELETE /api/v1/categories/:id
//  @access Private
*/
const deleteCategory = factory.deleteOne(Category);

module.exports = {
  uploadCategoryImage,
  resizeImage,
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
