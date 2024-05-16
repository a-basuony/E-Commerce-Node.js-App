const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");

/**
 * @desc   Gets list of brands
 * @route  GET /api/v1/brands
 * @access Public
 */
exports.getBrands = factory.getAll(Brand);

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
