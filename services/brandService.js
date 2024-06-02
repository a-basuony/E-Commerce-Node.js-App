const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const ApiError = require("../utils/apiError");

///--- setup the memory storage

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Not an image", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadBrandImage = upload.single("image"); // image is the name of image inside brand model

// --- resize middleware

const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

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
