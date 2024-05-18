const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

/**
// @desc     Get all categories
// @route    GET /api/v1/categories
// @access   Public
*/
// Setup multer for file uploads

//3
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/categories");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    // file.mimetype => mimetype: 'image/png' (type of file / extension of file)
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, filename);
    // cb(null, `category-${Date.now()}.${ext}`);
  },
});

// 3 add this step
//multerFilter function is used to ensure that only image files are allowed to be uploaded using the multer library.

// if=> file.mimetype.startsWith("image")||
//   file.mimetype === "image/png" ||
//   file.mimetype === "image/jpg" ||
//   file.mimetype === "image/jpeg"

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
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
