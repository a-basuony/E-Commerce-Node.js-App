const express = require("express");

const router = express.Router();

const {
  createSubCategory,
  getSubCategories,
  getSpecificSubCategory,
} = require("../services/subCategoryService");

// validation layer

const {
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
  createSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

router
  .route("/")
  .get(getSubCategories)
  .post(createSubCategoryValidator, createSubCategory);

router.route("/:id").get(getSubCategoryValidator, getSpecificSubCategory);

module.exports = router;
