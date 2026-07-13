const express = require("express")
const {auth} = require("./../../middlewares/auth")
const roleGuard = require("./../../middlewares/roleGuard")
const {getAllOrders,
updateOrder}= require("./../../controllers/v1/order")

const router = express.Router()


router.route("/").get(auth,getAllOrders)
router.route("/:id").path(auth,roleGuard(["ADMIN"]),updateOrder)

module.exports = router