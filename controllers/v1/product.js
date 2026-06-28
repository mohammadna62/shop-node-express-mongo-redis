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
    let {
      name,
      slug,
      description,
      subCategory,
      sellers,
      filterValues,
      customFilters,
    } = req.body;

    if (sellers) sellers = JSON.parse(sellers);
    filterValues = JSON.parse(filterValues);
    customFilters = JSON.parse(customFilters);

    if (!isValidObjectId(subCategory)) {
      return errorResponse(res, 400, "SubCategory ID is not correct !!");
    }

    const validatedData = await createProductValidator.validate(
      {
        name,
        slug,
        description,
        subCategory,
        sellers,
        filterValues,
        customFilters,
      },
      {
        abortEarly: false,
      }
    );

    let images = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      if (!supportedFormat.includes(file.mimetype)) {
        return errorResponse(res, 400, "UnSupported image format !!");
      }

      images.push(file.filename);
    }

    let shortIdentifier = "";
    while (!shortIdentifier) {
      shortIdentifier = nanoid(6);

      const product = await Product.findOne({
        shortIdentifier,
      });

      if (product) shortIdentifier = "";
    }

    const newProduct = await Product.create({
      name: validatedData.name,
      slug: validatedData.slug,
      description: validatedData.description,
      subCategory: validatedData.subCategory,
      images,
      sellers: validatedData.sellers.map((seller) => ({
        seller: seller.id,
        price: seller.price,
        stock: seller.stock,
      })),
      filterValues: validatedData.filterValues || {},
      customFilters: validatedData.customFilters || {},
      shortIdentifier,
    });

    return successResponse(res, 201, {
      message: "Product created successfully :))",
      product: newProduct,
    });
  } catch (err) {
    next(err);
  }
};
