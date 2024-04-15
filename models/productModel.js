const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      minlength: [2, "Product title must be at least 2 characters"],
      maxlength: [100, "Product title can't exceed 100 characters"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [2, "Product description must be at least 2 characters"],
      maxlength: [1000, "Product description can't exceed 1000 characters"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
    },
    sold: {
      // how many products are sold
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
      trim: true,
      min: [0, "Product price must be at least 0"],
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image cover required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category", // name of category model
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      // as an array of objects
      {
        type: mongoose.Schema.ObjectId,
        ref: "Subcategory", // name of subCategory model
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal to 1.0"],
      max: [5, "Rating must be below than 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
