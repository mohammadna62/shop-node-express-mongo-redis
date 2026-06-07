const path = require("path");
const express = require("express");
const authRouter =require("./routes/v1/auth")
const { setHeaders } = require("./middlewares/setHeaders");

const app = express();

app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json({ limit: "30mb" }));

app.use(setHeaders);

app.use(express.static(path.join(__dirname, "public")));

//* Routers
app.use('/auth',authRouter)

app.use((req, res) => {
  console.log("This Path Is Not Found", req.path);
  return res.status(404).json({
    message: "404! Path Not Found. Please double check the PAth  / Method ",
  });
});

//app.use(errorHandler)
module.exports = app;
