const Product = require("./../../models/Product");
const Comment = require("./../../models/Comment");

const { errorResponse, successResponse } = require("./../../helpers/responses");

exports.getComments = async (req, res, next) => {
  try {
    //! Codes
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const user = req.user;
    const { productId, rating, content } = req.body;

    //TODO Validator
    const product = await Product.findById(productId);

    if (!product) {
      return errorResponse(res, 404, "Product Not Found !!");
    }

    const newComment = await Comment.create({
      product: productId,
      user: user._id,
      rating,
      content,
      replies: [],
    });
    return successResponse(res, 201, {
      message: "Comment Created Successfully",
      comment: newComment,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateComments = async (req, res, next) => {
  try {
    //! Codes
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    //! Codes
  } catch (err) {
    next(err);
  }
};

exports.addReply = async (req, res, next) => {
  try {
    //! Codes
  } catch (err) {
    next(err);
  }
};

exports.updateReply = async (req, res, next) => {
  try {
    //! Codes
  } catch (err) {
    next(err);
  }
};

exports.deleteReply = async (req, res, next) => {
  try {
    //! Codes
  } catch (err) {
    next(err);
  }
};
