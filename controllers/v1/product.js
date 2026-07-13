const {
  createProductValidator,
  updateProductValidator,
} = require("./../../validators/product");
const Note = require("./../../models/Note");
const fs = require("fs");
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
      return errorResponse(res, 400, "Invalid SubCategory ID");
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
      },
    );

    let images = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      if (!supportedFormat.includes(file.mimetype)) {
        return errorResponse(res, 400, "Unsupported Image Format");
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
      message: "Product Created Successfully",
      product: newProduct,
    });
  } catch (err) {
    next(err);
  }
};
exports.getOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return errorResponse(res, 400, "Invalid Product ID");
    }
    const product = await Product.findById(id)
      .populate("subCategory")
      .populate("sellers.seller");
    if (!product) {
      return errorResponse(res, 404, "Product Not Found");
    }
    return successResponse(res, 200, { product });
  } catch (err) {
    next(err);
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    const user = req.user;
    const { id } = req.params;
    let { name, slug, description, subCategory, filterValues, customFilters } =
      req.body;

    if (filterValues) {
      filterValues = JSON.parse(filterValues);
    }
    if (customFilters) {
      customFilters = JSON.parse(customFilters);
    }

    if (!isValidObjectId(id)) {
      return errorResponse(res, 400, "Invalid Product ID");
    }

    const validatedUpdateData = await updateProductValidator.validate(
      {
        name,
        slug,
        description,
        subCategory,
        filterValues,
        customFilters,
      },
      { abortEarly: false },
    );

    let images = [];

    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        if (!supportedFormat.includes(file.mimetype)) {
          return errorResponse(res, 400, "Unsupported Image Format");
        }

        images.push(file.filename);
      }
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description,
        subCategory,
        filterValues,
        customFilters,
        images: images.length ? images : null,
      },
      { new: true },
    );

    if (!updatedProduct) {
      return errorResponse(res, 404, "Product Not Found");
    }

    return successResponse(res, 200, {
      product: updatedProduct,
      message: "Product Updated Successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 400, "Invalid Product ID");
    }
    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, 404, "Product Not Found");
    }
    await Note.deleteMany({ product: id });

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        try {
          await fs.promises.unlink(`public/images/products/${image}`);
        } catch (err) {
          console.error(`Error deleting image ${image}:`, err.message);
        }
      }
    }

    if (!deletedProduct) {
      return errorResponse(res, 404, "Product Not Found");
    }

    return successResponse(res, 200, {
      message: "Product Remove Successfully",
      product: deletedProduct,
    });
  } catch (err) {
    next(err);
  }
};
