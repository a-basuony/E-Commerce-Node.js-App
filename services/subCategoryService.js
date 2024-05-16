const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

// nested route
// * GEt /api/v1/categories/:categoryId/subcategories
// set req.params.categoryId to the req
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObj = filterObject;
  next();
};

/**
 * GEt /api/v1/categories/:categoryId/subcategories
 * GEt /api/v1/products/:productId/reviews
 * @desc     Get all SubCategories
 * @route    GET /api/v1/Subcategories
 * @access   Public
 */

exports.getSubCategories = factory.getAll(SubCategory);

// exports.getSubCategories = asyncHandler(async (req, res, next) => {
//   //Build Query
//   const documentsCount = await SubCategory.countDocuments();
//   const apiFeatures = new ApiFeatures(
//     SubCategory.find(req.filterObj),
//     req.query
//   )
//     .filter()
//     .sort()
//     // .search("subCategory", next)
//     .search()
//     .limitFields()
//     .paginate(documentsCount);

//   // Execute query
//   const { mongooseQuery, paginationResult } = apiFeatures;
//   const subCategories = await mongooseQuery;

//   if (!subCategories) {
//     return next(new ApiError("Failed to get Subcategories", 400));
//   }
//   res.status(200).json({
//     results: subCategories.length,
//     paginationResult,
//     data: subCategories,
//   });
// });

/**
 * @desc     Get specific SubCategory by id
 * @route    GET /api/v1/subCategory/:id
 * @access   Public
 */
exports.getSpecificSubCategory = factory.getOne(SubCategory);

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

/**
 * @desc     Create SubCategory
 * @route    POST /api/v1/Subcategories
 * @access   Private
 */
exports.createSubCategory = factory.createOne(SubCategory);

/**
 * @desc  Update a Subcategory
 * @route PUT /api/subcategories/:id
 * @access Private
 */
exports.updateSubCategory = factory.updateOne(SubCategory);

/**
 * @desc     Delete subCategory with id
 * @route    DELETE  api/v1/subcategories/:id
 * @access   Private
 */
exports.deleteSubCategory = factory.deleteOne(SubCategory);
