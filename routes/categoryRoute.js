const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");
const router = express.Router();

router.route("/").get(getCategories).post(createCategory);
// instead of
// router.get("/", createCategory);
// router.post("/", createCategory);

router
  .route("/:id")
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory); //localhost:3000/api/v1/categories/66082b89921a97fa27a5f5d9

module.exports = router;
