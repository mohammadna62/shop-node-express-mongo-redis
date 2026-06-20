const { errorResponse, successResponse } = require("../../helpers/responses");
const { categoryValidator } = require("./../../validators/category");
const Category = require("./../../models/Category");

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
      { title, slug, parent, description, filters },
      { abortEarly: false },
    );
    let icon = null;
    if (req.file) {
      const { filename, mimetype } = req.file;
      if (!supportedFormat.includes(mimetype)) {
        return errorResponse(res, 400, "Unsupported Image Format !!");
      }
      icon = {
        filename,
        path: `image/category-icons/${filename}`,
      };
    }
    const newCategory = await Category.create({
      title,
      slug,
      parent,
      description,
    });
    return successResponse(res, 201, { category: newCategory });
  } catch (err) {
    next(err);
  }
};
