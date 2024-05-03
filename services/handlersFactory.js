const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`document not found for this id: ${id}`, 404));
    }
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // and then return the updated document
    );

    if (!document) {
      return next(
        new ApiError(`Couldn't find this document with this id ${id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });
