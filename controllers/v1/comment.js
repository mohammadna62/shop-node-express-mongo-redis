const Product = require("./../../models/Product");
const Comment = require("./../../models/Comment");

const { errorResponse, successResponse } = require("./../../helpers/responses");
const {
  createCommentValidator,
  updateCommentValidator,
  addReplyValidator,
  updateReplyValidator,
} = require("../../validators/comment");
const { isValidObjectId } = require("mongoose");

exports.getComments = async (req, res, next) => {
  try {
    const { productId } = req.query;

    if (!isValidObjectId(productId)) {
      return errorResponse(res, 400, "Product Id is not correct !!");
    }
    const comments = await Comment.find({ product: productId })
      .populate({
        path:"user",
        select:"content"
      })
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select:"content"
        },
      })
      .lean();
    if (!comments) {
      return errorResponse(res, 404, "There is not any Comments !!");
    }
    return successResponse(res, 200, comments);
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const user = req.user;
    const { productId, rating, content } = req.body;

    await createCommentValidator.validate(
      { productId, rating, content },
      { abortEarly: false },
    );
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
    const { commentId } = req.params;
    if (!isValidObjectId(commentId)) {
      return errorResponse(res, 400, " Invalid Comment ID !!");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return errorResponse(res, 404, "Comment not found !!");
    }
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    return successResponse(res, 200, {
      message: "Comment Deleted Successfully",
      comment: deletedComment,
    });
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
