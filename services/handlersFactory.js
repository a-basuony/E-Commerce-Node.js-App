const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const { Model } = require("mongoose");

exports.getOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`Not found for this id: ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });
};

// exports.deleteProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await Product.findByIdAndDelete(id);
//   if (!product) {
//     return next(
//       new ApiError(`failed to delete product for this id: ${id}`, 404)
//     );
//   }
//   res.status(200).json({ message: "Deleted product successfully" });
// });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`document not found for this id: ${id}`, 404));
    }
    res.status(204).send();
  });

// exports.updateProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   if (req.body.title) {
//     req.body.slug = slugify(req.body.title);
//   }

//   const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
//     new: true,
//   }).populate({
//     path: "category",
//     select: "name",
//   });
//   if (!product) {
//     return next(
//       new ApiError(`failed to update product for this id: ${id}`, 400)
//     );
//   }
//   res.status(200).json({ data: product });
// });

// to apply slugify using a middleware instead of custom in validation
// exports.applySlugify = (req, res, next) => {
//   req.body.slug = slugify(req.body.name);
//   next();
// };

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(
      req.params.id,
      req.body, // slug using slugify => use a middleware or add it in custom validation
      { new: true } // and then return the updated document
    );

    if (!document) {
      return next(
        new ApiError(
          `Couldn't find this document with this id ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({ data: document });
  });

// const createCategory = asyncHandler(async (req, res) => {
//   const { name } = req.body;
//   const category = await Category.create({
//     name: name,
//     slug: slugify(name),
//   });
//   res.status(201).json({ data: category });
// });
exports.createOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    if (!document) {
      return next(new ApiError("Failed to create document", 400));
    }
    res.status(201).json({ data: document });
  });
};
