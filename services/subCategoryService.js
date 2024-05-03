const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const SubCategory = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// middleware used to create an object (filterObject) based on categoryId from req.params
//  it sets the category field in the filterObject to the categoryId
// Then, it assigns the filterObject to the req.filterObj property
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
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  //Build Query
  const documentsCount = await SubCategory.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategory.find({}), req.query)
    .filter()
    .sort()
    // .search("subCategory", next)
    .search()
    .limitFields()
    .paginate(documentsCount);

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const subCategories = await mongooseQuery;

  if (!subCategories) {
    return next(new ApiError("Failed to get Subcategories", 400));
  }
  res.status(200).json({
    results: subCategories.length,
    paginationResult,
    data: subCategories,
  });
});

/**
 * @desc     Get specific SubCategory by id
 * @route    GET /api/v1/subCategory/:id
 * @access   Public
 */
exports.getSpecificSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id).populate({
    path: "category",
    select: "name",
  });
  if (!subCategory) {
    next(new ApiError(`No subCategory for this this id: ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

// middleware function that is used to set the category field in the request body to the categoryId from the request params
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
 * @route    DELETE  api/v1/subcategories/:id
 * @access   Private
 */
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError("SubCategory not found", 404));
  }
  res.status(204).send();
});
