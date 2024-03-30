const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 1- create the schema for our user model
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category  name is required"], //  this means that if we don't provide a value for it , an error will be thrown and its message: "Category  name is required"
      unique: [true, "Category  already exists"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [32, "Too long category name"],
    },
    // Ahmed Basuony => shopping.com/ahmed-basuony  (space => -, lowercase )
    // so we use slugify package  to make it like that
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true } // to add two fields  createdAt & updatedAt in DB to know category knew  or not
);

//  2- create a Model using the CategorySchema
module.exports = mongoose.model("Category", categorySchema);
