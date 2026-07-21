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
const { createPaginationData } = require("./../../utils/index");

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
exports.getAllProducts = async (req, res, next) => {
  try {
    const {
      name,
      subCategory,
      minPrice,
      maxPrice,
      sellerId,
      filterValues,
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {
      "sellers.stock": { $gt: 0 },
    };

    if (name) {
      filters.name = { $regex: name, $option: "i" };
    }
    if (subCategory) {
      filters.subCategory =
        mongoose.Types.ObjectId.createFromHexString(subCategory);
    }

    if (minPrice) {
      filters["sellers.price"] = { $gte: +minPrice };
    }
    if (maxPrice) {
      filters["sellers.price"] = { $lte: +maxPrice };
    }
    if (sellerId) {
      filters["sellers.seller"] =
        mongoose.Types.ObjectId.createFromHexString(sellerId);
    }
    if (filterValues) {
      const parsedFilterValues = JSON.parse(filterValues);
      Object.keys(parsedFilterValues).forEach((key) => {
        filters[`filterValues.${key}`] = parsedFilterValues[key];
      });
    }

    const products = await Product.aggregate([
      {
        $match: filters,
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id", //* Product Model
          foreignField: "product", //* Comment.product Model
          as: "comments",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$comments" }, 0] },
              then: { $avg: `$comments.rating` },
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          comments: 0, //* Do Not Show Comment
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: +limit,
      },
    ]);
    const totalProductCount = await Product.countDocuments(filters)
    return successResponse(res, 200, {
      products,
      pagination: createPaginationData(+page,+limit,totalProductCount,"Products"),
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
