const {
  addToCartValidator,
  removeFromCartValidator,
} = require("../../validators/cart");
const Cart = require("./../../models/Cart");
const Product = require("./../../models/Product");
const Seller = require("./../../models/Seller");
const { errorResponse, successResponse } = require("./../../helpers/responses");
const { isValidObjectId } = require("mongoose");
const { populate } = require("../../models/Users");
exports.getCart = async (req, res, next) => {
  try {
    const user = req.user;

    const cart = await Cart.findOne({ user: user._id }).populate("items.product").populate("items.seller");

    if (!cart) {
      return errorResponse(res, 404, "Cart Not Found");
    }

    return successResponse(res, 200, { cart });
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    await addToCartValidator.validate(req.body, { abortEarly: false });

    const user = req.user;
    const { sellerId, productId, quantity } = req.body;

    if (!isValidObjectId(sellerId) || !isValidObjectId(productId)) {
      return errorResponse(res, 400, "Invalid Seller or Product ID");
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      return errorResponse(res, 404, "Product Not Found");
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return errorResponse(res, 404, "Seller Not Found");
    }

    const sellerDetails = product.sellers.find(
      (s) => s.seller.toString() === sellerId,
    );

    if (!sellerDetails) {
      return errorResponse(res, 400, "Product Not Sold by This Seller");
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
    const existingItem = cart.items.find((item) => {
      return (
        item.product.toString() === productId &&
        item.seller.toString() === sellerId
      );
    });
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.priceAtTimeOfAdding = priceAtTimeOfAdding;
    } else {
      cart.items.push({
        product: productId,
        seller: sellerId,
        quantity,
        priceAtTimeOfAdding,
      });
    }
    await cart.save();
    return successResponse(res, 200, { cart });
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const user = req.user;
    const { sellerId, productId } = req.body;

    await removeFromCartValidator.validate(req.body, { abortEarly: false });

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return errorResponse(res, 404, "Cart Not Found for User");
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId.toString() &&
        item.seller.toString() === sellerId.toString(),
    );

    if (itemIndex === -1) {
      return errorResponse(res, 404, "Product Not Found in Cart");
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    return successResponse(res, 200, {
      message: "Product Removed Successfully",
      cart,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeCart = async (req, res, next) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 400, "Invalid Cart ID");
    }

    const cart = await Cart.findById(id);

    if (!cart) {
      return errorResponse(res, 404, "Cart Not Found");
    }
    if (cart.user.toString() !== user._id.toString()) {
      return errorResponse(res, 403, "Action Not Permitted");
    }

    await Cart.deleteOne({ _id: id });

    return successResponse(res, 200, { message: "Cart Removed Successfully" });
  } catch (err) {
    next(err);
  }
};
