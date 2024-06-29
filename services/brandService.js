const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const Brand = require("../models/brandModel");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

///--- setup the memory storage
exports.uploadBrandImage = uploadSingleImage("image");
// --- resize middleware

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(700, 900)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`); // you need to create the folder name (brands)

  // save image into our db
  req.body.image = filename;
  next();
});

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
