const { createPayment, verifyPayment } = require("../../services/zarinpal");
const Cart = require("./../../models/Cart");
const Checkout = require("./../../models/Checkout");
const Order = require("./../../models/Order")
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
        return errorResponse(res, 400, "Product Not Sold by This Seller");
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
      amountInRial: newCheckout.totalPrice,
      description: ` Order Number ${newCheckout._id}`,
      mobile: user.phone,
    });

    newCheckout.authority = payment.authority;

    await newCheckout.save();

    return successResponse(res, 201, {
      message: "Checkout Created Successfully",
      checkout: newCheckout,
      paymentUrl: payment.paymentUrl,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyCheckout = async (req, res, next) => {
  try {
    const { Status, Authority: authority } = req.query;

    const alreadyCreatedOrder = await Order.findOne({ authority });
    if (alreadyCreatedOrder) {
      return errorResponse(res, 400, "Payment Already Verified");
    }

    const checkout = await Checkout.findOne({ authority });
    if (!checkout) {
      return errorResponse(res, 404, "Checkout Not Found");
    }

    const payment = await verifyPayment({
      authority,
      amountInRial: checkout.totalPrice,
    });

    if (![100, 101].includes(payment.data.code)) {
      return errorResponse(res, 400, "Payment Not Verified");
    }

    const order = new Order({
      user: checkout.user,
      authority: checkout.authority,
      items: checkout.items,
      shippingAddress: checkout.shippingAddress,
    });

    await order.save();

    return res.json({
      query: req.query,
      params: req.params,
    });
  } catch (err) {
    next(err);
  }
};
