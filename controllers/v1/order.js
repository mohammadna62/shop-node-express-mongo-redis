const { isValidObjectId } = require("mongoose");
const { successResponse, errorResponse } = require("../../helpers/responses");
const Order = require("./../../models/Order");
const { createPaginationData } = require("./../../utils/index");
const { updateOrderValidator } = require("./../../validators/order");

exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user = req.user;

    const filters = {
      ...(user.roles.includes("ADMIN") ? {} : { user: user._id }),
    };

    const orders = await Order.find(filters)
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user")
      .populate("items.product")
      .populate("items.seller");

    const totalOrders = await Order.countDocuments(filters);

    return successResponse(res, 200, {
      orders,
      pagination: createPaginationData(+page, +limit, totalOrders, "Orders"),
    });
  } catch (err) {
    next(err);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const { postTrackingCode, status } = req.body;
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 400, "Invalid Order ID");
    }
    await updateOrderValidator.validate(req.body, { abortEarly: false });

    const updateOrder = await Order.findByIdAndUpdate(
      id,
      {
        status,
        postTrackingCode,
      },
      { new: true },
    );

    if (!updateOrder) {
      return errorResponse(res, 404, "Order Not Found");
    }

    return successResponse(res, 200, {
      order: updateOrder,
      message: "Order Updated Successfully",
    });
  } catch (err) {
    next(err);
  }
};
