const mongoose = require("mongoose");

const { Schema } = mongoose;

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "brand name is required"],
      unique: [true, "brand name is already exist"],
      minLength: [2, "brand name must be at least 2 characters long"],
      maxLength: [32, "brand name must be at most 32 characters long"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
