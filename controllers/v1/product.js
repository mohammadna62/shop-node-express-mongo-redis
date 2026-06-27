const {
  createProductValidator,
  updateProductValidator,
} = require("./../../validators/product");
const Product = require("./../../models/Product");
const { errorResponse, successResponse } = require("../../helpers/responses");
const { nanoid } = require("nanoid");
const { isValidObjectId } = require("mongoose");

const supportedFormat = [
  "image/jpeg",
  "image/png",
  "image/svg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

exports.create = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      subCategory,
      seller,
      filterValues,
      customFilters,
    } = req.body;
    seller = JSON.parse(seller);
    filterValues = JSON.parse(filterValues);
    customFilters = JSON.parse(customFilters);

    if (!isValidObjectId(subCategory)) {
      return errorResponse(res, 400, "SubCategory ID is Not Correct !!");
    }
    //TODO -> validator
    let images = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      if (!supportedFormat.includes(file.mimetype)) {
        return errorResponse(res, 400, "Unsupported image format !!");
      }
      images.push(file.filename);
    }
    let shortIdentifier = "";
    while (!identifier) {
      identifier = nanoid(6);
      const product = await Product.findOne({ shortIdentifier });
      if (product) shortIdentifier = "";
    }
    const newProduct = await Product.create({
      name,
      slug,
      description,
      subCategory,
      images,
      seller,
      filterValues,
      customFilters,
      shortIdentifier,
    });
    return successResponse(res, 201, {
      message: "Product Created Successfully",
      product: newProduct,
    });
  } catch (err) {
    next(err);
  }
};
