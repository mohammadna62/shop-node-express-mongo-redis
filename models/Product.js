const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    images: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
    },
    seller: {
      type: [sellerSchema],
    },
    filterValues: {
      type: Map,
      of: mongoose.Types.Mixed, //* for any Type of filters (selectBox , inputs)
      required: true,
    },
    customFilters: {
      type: Map,
      of: String,
      required: true,
    },
    shortIdentifier: {
      type: String,
      of: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
