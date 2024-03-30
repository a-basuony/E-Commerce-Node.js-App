const slugify = require("slugify");

const CategoryModel = require("../models/categoryModel");

// const getCategories = (req, res) => {
//
// };

const createCategory = (req, res) => {
  const name = req.body.name;
  CategoryModel.create({ name: name, slug: slugify(name) })
    .then((category) => {
      res.status(201).json({ data: category });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
};

module.exports = {
  createCategory,
};
