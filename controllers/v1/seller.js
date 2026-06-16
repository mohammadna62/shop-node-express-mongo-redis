const Seller = require("./../../models/Seller");
const {
  createSellerValidator,
  updateSellerValidator,
} = require("../../validators/seller");
const { errorResponse, successResponse } = require("../../helpers/responses");
const cities = require("./../../cities/cities.json");
const seller = require("./../../models/Seller");

createSellerValidator;
exports.create = async (req, res, next) => {
  try {
    const { name, contactDetails, cityId } = req.body;
    const user = req.user;

    await createSellerValidator.validate(req.body, { abortEarly: false });

    const existingSeller = await Seller.findOne({ user: user._id });
    if (existingSeller) {
      return errorResponse(res, 400, "Seller already existing !!");
    }
    const city = cities.find((city) => +city.id === +cityId);
    if (!city) {
      return errorResponse(res, 409, "City is not Valid !!");
    }

    const seller = await Seller.create({
      name,
      contactDetails,
      cityId,
      user: user._id,
    });
    return successResponse(res, 201, {
      message: "Seller Create Successfully ",
      seller,
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, contactDetails, cityId } = req.body;
    const user = req.user;

    await updateSellerValidator.validate(req.body, { abortEarly: false });

    const existingSeller = await Seller.findOne({ user: user._id });
    if (!existingSeller) {
      return errorResponse(res, 404, "Seller Not Found");
    }
    const seller = await Seller.findByIdAndUpdate(
      existingSeller._id,
      {
        name,
        contactDetails,
        cityId,
      },
      { new: true },
    );
    return successResponse(res, 200, {
      message: "Seller Updated Successfully",
      seller,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteSeller = async (req, res, next) => {
  try {
    const user = req.user;
    const existingSeller = await Seller.findOne({ user: user._id });
    if (!existingSeller) {
      return errorResponse(res, 404, "Seller Not Found");
    }
    await existingSeller.deleteOne();
    //TODO Delete Products
    //TODO Delete Products from user shopping cart
    return successResponse(res, 200, {
      message: "Seller delete successfully",
      seller: existingSeller,
    });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const user = req.user;
    const seller = await Seller.findOne({ user: user._id });
    if (!seller) {
      return errorResponse(res, 404, "Seller Not Found");
    }
    return successResponse(res, 200, { seller });
  } catch (err) {
    next(err);
  }
};
