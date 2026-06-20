const { errorResponse, successResponse } = require("../../helpers/responses");
const { categoryValidator } = require("./../../validators/category");
const Category = require("./../../models/Category");
const { isValidObjectId } = require("mongoose");

const supportedFormat = [
  "image/jpeg",
  "image/png",
  "image/svg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

exports.createCategory = async (req, res, next) => {
  try {
    let { title, slug, parent, description, filters } = req.body;
    filters = JSON.parse(filters);

    await categoryValidator.validate(
      {
        title,
        slug,
        parent,
        description,
        filters,
      },
      { abortEarly: false },
    );

    let icon = null;
    if (req.file) {
      const { filename, mimetype } = req.file;

      if (!supportedFormat.includes(mimetype)) {
        return errorResponse(res, 400, "Unsupported image format !!");
      }

      icon = {
        filename,
        path: `images/category-icons/${filename}`,
      };
    }

    const newCategory = await Category.create({
      title,
      slug,
      parent,
      description,
      icon,
      filters,
    });

    return successResponse(res, 201, {
      category: newCategory,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    if (!isValidObjectId(categoryId)) {
      return errorResponse(res, 401, "Category ID is Not Valid !!");
    }
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return errorResponse(res, 404, "Category is Not Found !!");
    }
    return successResponse(res, 200, {
      message: "Category Deleted Successfully ",
      category: deletedCategory,
    });
  } catch (err) {
    next(err);
  }
};

exports.editCategory = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
