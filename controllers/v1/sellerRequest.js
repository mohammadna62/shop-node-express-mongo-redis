const { successResponse, errorResponse } = require("../../helpers/responses");
const SellerRequest = require("./../../models/sellerRequest");
const Seller = require("./../../models/Seller");
const {
  createSellerRequestValidator,
  updateSellerRequestValidator,
} = require("./../../validators/sellerRequest");
const Product = require("./../../models/Product");

exports.getAllSellerRequests = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
exports.createSellerRequest = async (req, res, next) => {
  try {
    const user = req.user;
    const { productId, price, stock } = req.body;

    await createSellerRequestValidator.validate(req.body, {
      abortEarly: false,
    });

    const seller = await Seller.findOne({ user: user._id });

    if (!seller) {
      errorResponse(res, 404, "Seller Not Found !!");
    }
    const existingRequest = await SellerRequest.findOne({
      seller: seller._id,
      product: productId,
    });

    if (existingRequest) {
      return errorResponse(
        res,
        400,
        "You already sent a request for this Product !!",
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return errorResponse(res, 404, "Product Not Existing Anymore !!");
    }

    const newCreateSellerRequest = await SellerRequest.create({
      product: productId,
      price,
      stock,
      seller: seller._id,
      status: "pending",
    });

    return successResponse(res, 201, {
      message: " Seller Request Created Successfully",
      request: newCreateSellerRequest,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateSellerRequest = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
exports.deleteSellerRequest = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
