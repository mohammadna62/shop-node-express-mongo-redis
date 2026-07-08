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
        path: "user",
        select: "content",
      })
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "content",
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

exports.updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content, rating } = req.body;
    const user = req.user;

    if (!isValidObjectId(commentId)) {
      return errorResponse(res, 400, " Invalid Comment ID !!");
    }

    await updateCommentValidator.validate(
      { content, rating },
      { abortEarly: false },
    );
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return errorResponse(res, 404, " Comment Not Found !!");
    }

    if (comment.user._id.toString() !== user._id.toString()) {
      return errorResponse(res, 403, " You don have access to this action  !!");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        content,
        rating,
      },
      { new: true },
    );

    return successResponse(res, 200, {
      message: "Comment Updated Successfully",
      comment: updatedComment,
    });
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
    const user = req.user;
    const { commentId } = req.params;
    const { content } = req.body;
    if (!isValidObjectId(commentId)) {
      return errorResponse(res, 400, "Comment ID is not valid !!");
    }
    await addReplyValidator.validate({ content }, { abortEarly: false });

    const reply = await Comment.findByIdAndUpdate(
      commentId,
      {
        $push: {
          replies: {
            content,
            user: user._id,
          },
        },
      },
      { new: true },
    );
    if (!reply) {
      return errorResponse(res, 404, "Comment not Found !!");
    }

    return successResponse(res, 200, { reply });
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
    const user = req.user;
    const { commentId, replyId } = req.params;
    if (!isValidObjectId(commentId) || !isValidObjectId(replyId)) {
      return errorResponse(res, 400, "Comment or Reply ID is not valid !!");
    }
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return errorResponse(res, 404, " Comment Not Found !!");
    }
    const reply = comment.replies.id(replyId);
    if (!reply) {
      return errorResponse(res, 404, " Reply Not Found !!");
    }
    comment.replies.pull(replyId);
    await comment.save();

    return successResponse(res, 200, {
      message: "Reply deleted Successfully !!",
    });
  } catch (err) {
    next(err);
  }
};
