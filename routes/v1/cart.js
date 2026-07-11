const express = require("express");
const { auth } = require("./../../middlewares/auth");
const {
  getCart,
  addToCart,
  removeFromCart,
} = require("./../../controllers/v1/cart");
const router = express.Router();

router.route("/").get(auth, getCart);
router.route("/add").get(auth, addToCart);
router.route("/remove").get(auth, removeFromCart);

module.exports = router;
