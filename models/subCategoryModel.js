const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory must be unique"],
      minLength: [2, "Name must have at least 2 characters"],
      maxLength: [30, "Name can't exceed 30 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    //each subcategory must belong to a parent category.
    category: {
      type: mongoose.Schema.ObjectId, //
      //The "category" field stores the unique ID of the parent category,
      ref: "Category", // the ref option establishes a relationship between the "SubCategory" and "Category" models.
      // It specifies the name of the referenced model. In this case, it indicates that the "category" field refers to documents in the "Category" model.
      required: [true, "SubCategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
