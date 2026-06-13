const { errorResponse, successResponse } = require("../../helpers/responses");
const Ban = require("../../models/Ban");
const User = require("../../models/Users");

exports.banUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return errorResponse(res, 404, "User not found !!");
    }

    if (user.roles.includes("ADMIN")) {
      return errorResponse(res, 403, "You cannot ban an admin !!");
    }

    const deletedUser = await User.findOneAndDelete({ _id: userId });

    await Ban.create({ phone: user.phone });

    return successResponse(res, 200, {
      user: deletedUser,
      message: "User banned successfully, user and posts removed",
    });
  } catch (err) {
    next(err);
  }
};
