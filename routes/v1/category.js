const express = require("express");
const { auth } = require("./../../middlewares/auth");
const roleGuard = require("./../../middlewares/roleGuard");
const { multerStorage } = require("./../../utils/multerConfigs");
const { createCategory,editCategory,deleteCategory } = require("../../controllers/v1/category");

const upload = multerStorage("public/images/category-icons");

router = express.Router();

router
  .route("/")
  .post(auth, roleGuard("ADMIN"), upload.single("icon"), createCategory);
router
  .route("/:categoryId")
  .put(auth, roleGuard("ADMIN"), upload.single("icon"), editCategory).delete(auth, roleGuard("ADMIN"), deleteCategory);

module.exports = router;
