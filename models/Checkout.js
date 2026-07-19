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

const checkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [checkoutItemSchema],

    shippingAddress: {
      postalCode: {
        type: String,
        required: true,
      },

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
      type: String,
      unique: true,
      required: true,
    },

    expiresAt: {
      //* TTL Method ->Time To Live
      type: Date,
      required: true,
      default: () => Date.now() + 5 * 1000,
    },
  },
  { timestamps: true },
);

checkoutSchema.virtual("totalPrice").get(function () {
  return this.items.reduce((total, item) => {
    return total + item.priceAtTimeOfPurchase * item.quantity;
  }, 0);
});

checkoutSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const model = mongoose.model("Checkout", checkoutSchema);

module.exports = model;
