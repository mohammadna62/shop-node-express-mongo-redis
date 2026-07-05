const { successResponse, errorResponse } = require("../../helpers/responses");
const SellerRequest = require("./../../models/sellerRequest");
const Seller = require("./../../models/Seller");
const {
  createSellerRequestValidator,
  updateSellerRequestValidator,
} = require("./../../validators/sellerRequest");
const Product = require("./../../models/Product");
const { isValidObjectId } = require("mongoose");
const { createPaginationData } = require("../../utils/index");

exports.getAllSellerRequests = async (req, res, next) => {
  try {
    const user = req.user;
    const { status = "pending", page = 1, limit = 10 } = req.query;

    const seller = await Seller.findOne({ user: user._id });

    if (!seller) {
      return errorResponse(res, 404, "You are not a Seller !!");
    }

    const filter = {
      seller: seller._id,
      status,
    };
    const sellerRequests = await SellerRequest.find(filter)
      .sort({
        createdAt: "desc",
      })
      .skip((page - 1) * limit)
      .limit(limit).lean();

    const sellerRequestTotalCount = await SellerRequest.countDocuments(filter);
    return successResponse(res, 200, {
      sellerRequests,
      pagination: createPaginationData(
        page,
        limit,
        sellerRequestTotalCount,
        "SellerRequests",
      ),
    });
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
    const { id } = req.params;
    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 400, " Wrong Seller Request ID !!");
    }

    const seller = await Seller.findOne({ user: user._id });

    if (!seller) {
      return errorResponse(res, 404, "Seller not found !!");
    }

    const sellerRequest = await SellerRequest.findById(id);

    if (!sellerRequest) {
      return errorResponse(res, 404, "Seller Request Not Found  !!");
    }

    if (sellerRequest.seller.toString() !== seller._id.toString()) {
      return errorResponse(
        res,
        403,
        "You do not have access to this request !!",
      );
    }
    if (sellerRequest.status !== "pending") {
      return errorResponse(
        res,
        400,
        "Seller request already Rejected or Accepted , Can not be deleted",
      );
    }
    await SellerRequest.findByIdAndDelete(id);

    return successResponse(res, 200, {
      message: "Seller Request deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
