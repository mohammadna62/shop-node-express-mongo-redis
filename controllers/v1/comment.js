const Product = require("./../../models/Product");
const Comment = require("./../../models/Comment");
const {createPaginationData}  = require("./../../utils/index")
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
      return errorResponse(res, 400, "Invalid Product ID");
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
      return errorResponse(res, 404, "No Comments Found");
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
      return errorResponse(res, 404, "Product Not Found");
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

exports.getAllComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const comments = await Comment.find()
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("product")
      .populate("user", "-addresses")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "-addresses",
        },
      });
       
      const totalComments = await Comment.countDocuments


      return successResponse(res , 200 , {comments,pagination:createPaginationData(page , limit ,totalComments , "Comments")})
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
      return errorResponse(res, 400, "Invalid Comment ID");
    }

    await updateCommentValidator.validate(
      { content, rating },
      { abortEarly: false },
    );
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return errorResponse(res, 404, "Comment Not Found");
    }

    if (comment.user._id.toString() !== user._id.toString()) {
      return errorResponse(res, 403, "Access Denied");
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
      return errorResponse(res, 400, "Invalid Comment ID");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return errorResponse(res, 404, "Comment Not Found");
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
      return errorResponse(res, 400, "Invalid Comment ID");
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
      return errorResponse(res, 404, "Comment Not Found");
    }

    return successResponse(res, 200, { reply });
  } catch (err) {
    next(err);
  }
};

exports.updateReply = async (req, res, next) => {
  try {
    const user = req.user;
    const { commentId, replyId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId) || !isValidObjectId(replyId)) {
      return errorResponse(res, 400, "Invalid Comment or Reply ID");
    }

    await updateReplyValidator.validate({ content }, { abortEarly: false });

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return errorResponse(res, 404, "Comment Not Found");
    }
    let reply = comment.replies.id(replyId);
    if (!reply) {
      return errorResponse(res, 404, "Reply Not Found");
    }
    if (reply.user.toString() !== user._id.toString()) {
      return errorResponse(res, 403, "Access Denied");
    }

    reply.content = content;

    await comment.save();

    return successResponse(res, 200, {
      message: "Replay Updated Successfully ",
      comment,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteReply = async (req, res, next) => {
  try {
    const { commentId, replyId } = req.params;
    if (!isValidObjectId(commentId) || !isValidObjectId(replyId)) {
      return errorResponse(res, 400, "Invalid Comment or Reply ID");
    }
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return errorResponse(res, 404, "Comment Not Found");
    }
    const reply = comment.replies.id(replyId);
    if (!reply) {
      return errorResponse(res, 404, "Reply Not Found");
    }
    comment.replies.pull(replyId);
    await comment.save();

    return successResponse(res, 200, {
      message: "Reply deleted Successfully",
    });
  } catch (err) {
    next(err);
  }
};
