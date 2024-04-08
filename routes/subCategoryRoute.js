const express = require("express");

const router = express.Router();

const {
  createSubCategory,
  getSubCategories,
  getSpecificSubCategory,
  updateSubCategory,
  deleteSubCategory,
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

router
  .route("/:id")
  .get(getSubCategoryValidator, getSpecificSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory); //localhost:3000/api/v1/subcategories/66082b89921a97fa27a5f5d9

module.exports = router;
