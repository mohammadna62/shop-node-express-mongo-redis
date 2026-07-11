const {
  addToCartValidator,
  removeFromCartValidator,
} = require("../../validators/cart");
const Cart = require("./../../models/Cart");
const Product = require("./../../models/Product");
const Seller = require("./../../models/Seller");
const { errorResponse, successResponse } = require("./../../helpers/responses");
const { isValidObjectId } = require("mongoose");
exports.getCart = async (req, res, next) => {
  try {
    //! Code
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const user = req.user;
    const { sellerId, productId, quantity } = req.body;

    await addToCartValidator.validate(req.body, { abortEarly: false });
    if (!isValidObjectId(productId) || !isValidObjectId(sellerId)) {
      return errorResponse(res, 400, "Seller Or Product ID Not Valid !!");
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      return errorResponse(res, 404, "Product Not Found !!");
    }
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return errorResponse(res, 404, "Seller Not Found !!");
    }

    const sellerDetails = product.sellers.find((s) => {
      s.seller.toString() === seller._id.toString();
    });

    if (!sellerDetails) {
      return errorResponse(res, 400, "Seller does not sell this product !!");
    }

    const cart = await Cart.findOne({ user: user._id });
    const priceAtTimeOfAdding = sellerDetails.price;

    if (!cart) {
      const newCart = await Cart.create({
        user: user._id,
        items: [
          {
            product: productId,
            seller: sellerId,
            quantity,
            priceAtTimeOfAdding,
          },
        ],
      });

      return successResponse(res, 200, {
        cart: newCart,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    //! Code
  } catch (err) {
    next(err);
  }
};
