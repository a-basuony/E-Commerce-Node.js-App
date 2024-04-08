const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("Too Short Category name ")
    .isLength({ max: 32 })
    .withMessage("Too Long Category name"),
  check("category")
    .notEmpty()
    .withMessage("subcategory must be belong to category")
    .isMongoId()
    .withMessage("Invalid category id format"),

  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID"),
  validatorMiddleware,
];
