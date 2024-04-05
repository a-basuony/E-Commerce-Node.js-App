const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");
const router = express.Router();
// validation layer
const { param, validationResult } = require("express-validator");
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidator");

router
  .route("/")
  .get(getCategories)
  .post(createCategoryValidator, createCategory);
// instead of
// router.get("/", createCategory);
// router.post("/", createCategory);

router
  .route("/:id")
  .get(getCategoryValidator, getCategoryById)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory); //localhost:3000/api/v1/categories/66082b89921a97fa27a5f5d9

module.exports = router;
