const express = require("express")
const { banUser,createAddress } = require("../../controllers/v1/user")
const {auth} = require("./../../middlewares/auth")
const roleGuard = require("../../middlewares/roleGuard")

const router = express.Router()

router.route('/ban/:userId').post(auth,roleGuard("ADMIN"),banUser)
router.route('/me/addresses').post(auth,createAddress)



module.exports = router



