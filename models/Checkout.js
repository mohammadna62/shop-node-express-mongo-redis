const mongoose = require("mongoose");

const checkoutItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

  priceAtTimeOfPurchase: {
    type: Number,
    required: true,
  },
});
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [checkoutItemSchema],
    shippingAddress: {
      postalCode: { type: String, required: true },

      location: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
      address: {
        type: String,
        required: true,
      },
      cityId: {
        type: Number,
        required: true,
      },
    },

    authority: {
      type: Number,
      unique: true,
      required: true,
    },
  },

  { timestamps: true },
);

const model = mongoose.model("Checkout", orderSchema);

module.exports = model;
