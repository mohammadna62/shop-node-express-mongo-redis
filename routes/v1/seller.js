const express = require("express")
const router = express.Router()
const {auth}= require("./../../middlewares/auth")
const roleGuard = require("./../../middlewares/roleGuard")
const { create } = require("../../controllers/v1/seller")


router.route("/").post(auth,roleGuard("SELLER"),create)




module.exports = router 