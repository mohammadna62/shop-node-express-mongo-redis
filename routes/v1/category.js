const express = require("express")
const auth = require("./../../middlewares/auth")
const roleGuard = require("./../../middlewares/roleGuard")
const upload = require("./../../utils/multerConfigs")
const {createCategory} = require("../../controllers/v1/category")
router = express.Router()

router.rout("/").post(auth,roleGuard("ADMIN"),upload.single("icon"),createCategory )




module.exports = router