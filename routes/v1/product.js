const express = require("express");
const {auth} = require("./../../middlewares/auth");
const roleGuard = require("../../middlewares/roleGuard");
const { create } = require("../../controllers/v1/product");
const {multerStorage} = require("./../../utils/multerConfigs")

const upload = multerStorage('public/images/products')

const router = express.Router();

router.route("/").post(auth, roleGuard("ADMIN"), upload.array("images",10),create)

module.exports = router;
