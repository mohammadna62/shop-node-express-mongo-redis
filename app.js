const path = require("path");
const express = require("express");
const authRouter = require("./routes/v1/auth");
const usersRouter = require("./routes/v1/user");
const sellersRouter = require("./routes/v1/seller");
const locationsRouter = require("./routes/v1/location");
const categoriesRouter = require("./routes/v1/category");
const productsRouter = require("./routes/v1/product");
const notesRouter = require("./routes/v1/note");
const sellerRequestsRouter = require("./routes/v1/sellerRequest");
const commentsRouter = require("./routes/v1/comment");
const cartsRouter = require("./routes/v1/cart");
const ordersRouter = require("./routes/v1/order");
const checkoutsRouter = require("./routes/v1/checkout");
const apiDocRouter = require("./routes/v1/apidoc");
const { redirectProduct } = require("./controllers/v1/shortLink");
const { setHeaders } = require("./middlewares/setHeaders");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json({ limit: "30mb" }));

app.use(setHeaders);

app.use(express.static(path.join(__dirname, "public")));

//* Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/locations", locationsRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/sellers", sellersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/seller-requests", sellerRequestsRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/carts", cartsRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/checkout", checkoutsRouter);
app.get("/p/:shortIdentifier", redirectProduct);
app.use("/apis", apiDocRouter);

app.use((req, res) => {
  console.log("This Path Is Not Found", req.path);
  return res.status(404).json({
    message: "404! Endpoint Not Found ",
  });
});

app.use(errorHandler);
module.exports = app;
