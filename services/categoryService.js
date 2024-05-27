const asyncHandler = require("express-async-handler");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

// Setup multer for file uploads

//3- DiskStorage
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/categories");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

// ------ -----------

//3- Memory Storage
const multerStorage = multer.memoryStorage();

//4- multerFilter => ensure that only image files
const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true); // Allow the file to be uploaded
  } else {
    cb(new ApiError("Only Images allowed", 400), false); // Disallow the file to be uploaded
  }
};
//4
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
//5
const uploadCategoryImage = upload.single("image");

const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${filename}`);

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
