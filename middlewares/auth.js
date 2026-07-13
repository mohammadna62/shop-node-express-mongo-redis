const { errorResponse } = require("../helpers/responses");
const jwt = require("jsonwebtoken");
const User = require("./../models/Users");


exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return errorResponse(res, 401, "Token Required");
    }

    const tokenArray = token.split(" ");
    const tokenValue = tokenArray[1];

    if (tokenArray[0] !== "Bearer") {
      return errorResponse(
        res,
        401,
        "Write [Bearer ] at the start ot the token"
      );
    }

    const decoded = jwt.decode(tokenValue, process.env.JWT_SECRET);

    if (!decoded) {
      return errorResponse(res, 401, "Invalid Token");
    }

    const userId = decoded.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return errorResponse(res, 404, "User Not Found");
    }

    

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
