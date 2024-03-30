const express = require("express");
const { createCategory } = require("../services/categoryService");
const router = express.Router();

router.route("/").get(createCategory).post(createCategory);
// instead of
// router.get("/", createCategory);
// router.post("/", createCategory);

module.exports = router;
