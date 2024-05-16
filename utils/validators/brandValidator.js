const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 validator")
    .isLength({ max: 32 })
    .withMessage("name must be at least 32 validator")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.getSpecificBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID format validator"),
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 validator")
    .isLength({ max: 32 })
    .withMessage("name must be at least 32 validator")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand Id format validator"),
  validatorMiddleware,
];
