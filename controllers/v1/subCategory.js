const parentCategory = require("../../models/Category");
const { subCategoryValidator } = require("../../validators/category");
const SubCategory = require("./../../models/SubCategory");

exports.createSunCategory = async (req, res, next) => {
  try {
    let { title, slug, parent, description, filters } = req.body;
    filters = JSON.parse(filters);

    await subCategoryValidator.validate(
      {
        title,
        slug,
        parent,
        description,
        filters,
      },
      { abortEarly: false },
    );
    const parentCheck = await parentCategory.findById(parent);
    if (!parentCheck) {
      return errorResponse(res, 400, "Parent ID Not Found !!");
    }
    const category = await SubCategory.create({
      title,
      slug,
      parent,
      description,
      filters,
    });

    return successResponse(res, 201, {
      category,
      message: "SubCategory Created Successfully ",
    });
  } catch (err) {
    next(err);
  }
};
