const express = require("express");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");

const router = express.Router();
// validation layer
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidator");

const subCategoriesRoute = require("./subCategoryRoute");

// Nested routes for subcategories
router.use("/:categoryId/subcategories", subCategoriesRoute);

console.log("uploadCategoryImage:", uploadCategoryImage); // Add this line to check if uploadCategoryImage is defined

router
  .route("/")
  .get(getCategories)
  .post(
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
// instead of
// router.get("/", createCategory);
// router.post("/", createCategory);

router
  .route("/:id")
  .get(getCategoryValidator, getCategoryById)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory); //localhost:3000/api/v1/categories/66082b89921a97fa27a5f5d9

module.exports = router;
