const express = require("express");
const swaggerUi = require("swagger-ui-express");

const router = express.Router();

const swaggerDoc = require("./../../swagger/swagger.json");

const swaggerOption ={
customCss: `.swagger-ui .topbar {display:none;},`,
}

router.use("/", swaggerUi.serve);
router.use(
  "/",
  swaggerUi.setup(swaggerDoc,swaggerOption),
);

module.exports = router;
