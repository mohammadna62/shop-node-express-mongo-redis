const express = require("express");
const { auth } = require("./../../middlewares/auth");
const roleGuard = require("./../../middlewares/roleGuard");
const { multerStorage } = require("./../../utils/multerConfigs");
const {
  createCategory,
  editCategory,
  deleteCategory,
} = require("../../controllers/v1/category");
const {
  createSubCategory,
  getAllSubCategories,
  getSubCategory,
  deleteSubCategory,
  editSubCategory
} = require("../../controllers/v1/subCategory");

const upload = multerStorage("public/images/category-icons");

router = express.Router();

router
  .route("/")
  .post(auth, roleGuard("ADMIN"), upload.single("icon"), createCategory);
router
  .route("/:categoryId")
  .put(auth, roleGuard("ADMIN"), upload.single("icon"), editCategory)
  .delete(auth, roleGuard("ADMIN"), deleteCategory);
router
  .route("/sub")
  .post(auth, roleGuard("ADMIN"), createSubCategory)
  .get(getAllSubCategories);

router
  .route("/sub/:categoryId")
  .get(getSubCategory)
  .delete(auth, roleGuard("ADMIN"), deleteSubCategory)
  .put(auth, roleGuard("ADMIN"), upload.single("icon"), editSubCategory);

module.exports = router;
