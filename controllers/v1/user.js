const { errorResponse, successResponse } = require("../../helpers/responses");
const Ban = require("../../models/Ban");
const User = require("../../models/Users");
const cities = require("./../../cities/cities.json");

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

exports.createAddress = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, postalCode, location, address, cityId } = req.body;

    //* Validation

    const city = cities.find((city) => +city.id === +cityId);

    if (!city) {
      return errorResponse(res, 409, "City is not valid !!");
    }

    const addressObject = {
      name,
      postalCode,
      location,
      address,
      cityId,
    };

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $push: {
          addresses: addressObject,
        },
      },
      {
        new: true,
      },
    );

    return successResponse(res, 201, {
      user: updatedUser,
      message: "Address created successfully :))",
    });
  } catch (err) {
    next(err);
  }
};
