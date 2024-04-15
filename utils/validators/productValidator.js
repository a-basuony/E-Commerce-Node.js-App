const { check, param, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createProductValidator = [
  check("title")
    .isString()
    .isLength({ min: 2, max: 100 })
    .trim()
    .withMessage("Product title must be between 2 and 100 characters")
    .notEmpty()
    .withMessage("Product required"),
  check("slug")
    .notEmpty()
    .withMessage("Product required")
    .isString()
    .isLength({ max: 2000 })
    .withMessage("Too long description")
    .isLowercase()
    .withMessage("Slug must be a lowercase string"),
  check("description")
    .isString()
    .isLength({ min: 2, max: 1000 })
    .trim()
    .withMessage("Product description must be between 2 and 1000 characters"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity must be required")
    .isNumeric()
    .withMessage("Product quantity must be a number")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),
  check("sold").optional().isNumeric().withMessage(" must be number"),
  check("price")
    .isNumeric()
    .withMessage(" must be a number")
    .notEmpty()
    .withMessage("Product price must be a number")
    .isFloat({ min: 0, max: 200000 })
    .withMessage("Price must be a float between 0 and 20"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product price after discount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error(
          "Product price after discount must be lower than the price"
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  check("imageCover")
    .notEmpty()
    .isString()
    .withMessage("Image cover must be a string"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("product must be belong to a category")
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId"),
  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("Subcategory must be a valid MongoDB ObjectId"),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Brand must be a valid MongoDB ObjectId"),
  check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings average must be a float between 1 and 5"),
  check("ratingsQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Ratings quantity must be a non-negative integer"),
  validatorMiddleware,
];

exports.getSpecificProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
  body("title")
    .optional()
    .isString()
    .isLength({ min: 2, max: 100 })
    .trim()
    .withMessage("Product title must be between 2 and 100 characters"),
  body("slug")
    .optional()
    .isString()
    .isLowercase()
    .withMessage("Slug must be a lowercase string"),
  body("description")
    .optional()
    .isString()
    .isLength({ min: 2, max: 1000 })
    .trim()
    .withMessage("Product description must be between 2 and 1000 characters"),
  body("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),
  body("price")
    .optional()
    .isFloat({ min: 0, max: 20 })
    .withMessage("Price must be a float between 0 and 20"),
  body("imageCover")
    .optional()
    .isString()
    .withMessage("Image cover must be a string"),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId"),
  body("subcategory")
    .optional()
    .isMongoId()
    .withMessage("Subcategory must be a valid MongoDB ObjectId"),
  body("brand")
    .optional()
    .isMongoId()
    .withMessage("Brand must be a valid MongoDB ObjectId"),
  body("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings average must be a float between 1 and 5"),
  body("ratingsQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Ratings quantity must be a non-negative integer"),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];
