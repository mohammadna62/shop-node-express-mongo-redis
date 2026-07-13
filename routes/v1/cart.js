const express = require("express");
const { auth } = require("./../../middlewares/auth");
const {
  getCart,
  addToCart,
  removeFromCart,
  removeCart
} = require("./../../controllers/v1/cart");
const router = express.Router();

router.route("/").get(auth, getCart);
router.route("/add").post(auth, addToCart);
router.route("/remove").delete(auth, removeFromCart);
router.route("/:id").delete(auth, removeCart);

module.exports = router;
