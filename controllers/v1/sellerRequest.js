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
      return errorResponse(res, 404, "Seller Access Required");
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
      .limit(limit)
      .lean();

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
      errorResponse(res, 404, "Seller Not Found");
    }
    const existingRequest = await SellerRequest.findOne({
      seller: seller._id,
      product: productId,
    });

    if (existingRequest) {
      return errorResponse(
        res,
        400,
        "Request Already Sent for This Product",
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return errorResponse(res, 404, "Product Not Available");
    }

    const newCreateSellerRequest = await SellerRequest.create({
      product: productId,
      price,
      stock,
      seller: seller._id,
      status: "pending",
    });

    return successResponse(res, 201, {
      message: "Seller Request Created Successfully",
      request: newCreateSellerRequest,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateSellerRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;
    await updateSellerRequestValidator.validate(
      { status, adminComment },
      {
        abortEarly: false,
      },
    );
    const sellerRequest = await SellerRequest.findById(id);

    if (!sellerRequest) {
      return errorResponse(res, 404, "Seller Request Not Found");
    }
    if (status === "reject") {
      sellerRequest.status = "rejected";
      if (adminComment) {
        sellerRequest.adminComment = adminComment;
      }
      await sellerRequest.save();
      return successResponse(res, 200, {
        message: "Seller Request Rejected",
        sellerRequest,
      });
    } else if (status === "accept") {
      const product = await Product.findById(sellerRequest.product);
      if (!product) {
        return errorResponse(res, 404, "Product Not Found");
      }
      const existingProductSeller = product.sellers.find(
        (seller) =>
          seller.seller.toString() === sellerRequest.seller.toString(),
      );
      if (existingProductSeller) {
        return errorResponse(
          res,
          400,
          "Seller Already Exists for This Product",
        );
      }
      product.sellers.push({
        seller: sellerRequest.seller,
        price: sellerRequest.price,
        stock: sellerRequest.stock,
      });
      await product.save();
      sellerRequest.status = "accepted";
      if (adminComment) {
        sellerRequest.adminComment = adminComment;
      }
      await sellerRequest.save();
      return successResponse(res, 200, {
        message:
          "Seller Request Accepted Successfully",
      });
    }
  } catch (err) {
    next(err);
  }
};
exports.deleteSellerRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 400, "Invalid Seller Request ID");
    }

    const seller = await Seller.findOne({ user: user._id });

    if (!seller) {
      return errorResponse(res, 404, "Seller Not Found");
    }

    const sellerRequest = await SellerRequest.findById(id);

    if (!sellerRequest) {
      return errorResponse(res, 404, "Seller Request Not Found");
    }

    if (sellerRequest.seller.toString() !== seller._id.toString()) {
      return errorResponse(
        res,
        403,
        "Access Denied",
      );
    }
    if (sellerRequest.status !== "pending") {
      return errorResponse(
        res,
        400,
        "Cannot Delete Processed Request",
      );
    }
    await SellerRequest.findByIdAndDelete(id);

    return successResponse(res, 200, {
      message: "Seller Request Deleted Successfully",
    });
  } catch (err) {
    next(err);
  }
};
