const { createPayment } = require("../../services/zarinpal");
const Cart = require("./../../models/Cart");
const Checkout = require("./../../models/Checkout");
const { createCheckoutValidator } = require("./../../validators/checkout");
const { errorResponse, successResponse } = require("./../../helpers/responses");

exports.createCheckout = async (req, res, next) => {
  try {
    const user = req.user;
    const { shippingAddress } = req.body;

    await createCheckoutValidator.validate(req.body, { abortEarly: false });

    const cart = await Cart.findOne({ user: user._id })
      .populate("items.product")
      .populate("items.seller");

    if (!cart?.items?.length) {
      return errorResponse(res, 400, "Cart is empty or not found !!");
    }

    const checkoutItems = [];

    for (const item of cart.items) {
      const { product, seller } = item;

      const sellerDetails = product.sellers.find(
        (sellerInfo) => sellerInfo.seller.toString() === seller._id.toString(),
      );

      if (!sellerDetails) {
        return errorResponse(res, 400, "Seller does not sell this product !!");
      }

      checkoutItems.push({
        product: product._id,
        seller: seller._id,
        quantity: item.quantity,
        priceAtTimeOfPurchase: sellerDetails.price,
      });
    }

    const newCheckout = new Checkout({
      user: user._id,
      items: checkoutItems,
      shippingAddress,
    });

    const payment = await createPayment({
      amountInRial: 3000,
      description: `سفارش با شناسه ${newCheckout._id}`,
      mobile: "09921558293",
    });

    newCheckout.authority = payment.authority;

    await newCheckout.save();

    return successResponse(res, 201, {
      message: "Checkout created successfully :))",
      checkout: newCheckout,
      paymentUrl: payment.paymentUrl,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyCheckout = async (req, res, next) => {
  try {
    //Codes
  } catch (err) {
    next(err);
  }
};
