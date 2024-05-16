const { check, param, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const Subcategory = require("../../models/subCategoryModel");
const { trusted } = require("mongoose");
const slugify = require("slugify");

exports.createProductValidator = [
  check("title")
    .isString()
    .isLength({ min: 2, max: 100 })
    .trim()
    .withMessage("Product title must be between 2 and 100 characters")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("slug").optional(),
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
    .withMessage("Category must be a valid MongoDB ObjectId")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),
  check("subcategories")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Subcategories must be an array with at least one element")
    .custom((subcategoriesIds) =>
      Subcategory.find({ _id: { $in: subcategoriesIds } }).then((result) => {
        if (result.length !== subcategoriesIds.length) {
          return Promise.reject(new Error("Invalid subcategory id format"));
        }
      })
    )

    .custom(async (subcategoriesIds, { req }) => {
      const categoryId = req.body.category;
      const subcategories = await Subcategory.find({
        _id: { $in: subcategoriesIds },
        category: categoryId,
      });
      if (subcategories.length !== subcategoriesIds.length) {
        return Promise.reject(
          new Error("Subcategories do not belong to the category")
        );
      }
    }),
  // .custom((val, { req }) => {
  //   Subcategory.find({ category: req.body.category }).then(
  //     (subcategories) => {
  //       const subCategoriesIdsInDB = [];
  //       subcategories.forEach((subcategory) => {
  //         subCategoriesIdsInDB.push(subcategory._id.toString());
  //       });
  //       if (!val.every((v) => subCategoriesIdsInDB.includes(v))) {
  //         return Promise.reject(
  //           new Error("Subcategories do not belong to the category")
  //         );
  //       }
  //     }
  //   );
  // }),
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
    .withMessage("Product title must be between 2 and 100 characters")
    .trim()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  body("slug")
    .optional()
    .isString()
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
    .isFloat({ min: 0, max: 200000 })
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
