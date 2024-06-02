const express = require("express");
const {
  getBrands,
  createBrand,
  getSpecificBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
} = require("../services/brandService");
const {
  createBrandValidator,
  getSpecificBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getSpecificBrandValidator, getSpecificBrand)
  .put(uploadBrandImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
