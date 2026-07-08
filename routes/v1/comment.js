const express = require("express");
const { auth } = require("./../../middlewares/auth");
const roleGuard = require("./../../middlewares/roleGuard");
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  addReply,
  updateReply,
  deleteReply,
} = require("./../../controllers/v1/comment");
const router = express.Router();

router.route("/").get(getComments).post(auth, createComment);
router
  .route("/:commentId")
  .patch(auth, updateComment)
  .delete(auth, roleGuard("ADMIN"), deleteComment);
router.route("/:commentId/reply").post(auth, addReply);

router
  .route("/:commentId/reply/:replyId")
  .patch(auth, updateReply)
  .delete(auth, roleGuard("ADMIN"), deleteReply);

module.exports = router;
