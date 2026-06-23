const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../../helpers/responses");
const ParentCategory = require("../../models/Category");
const SubCategory = require("../../models/SubCategory");
const { subCategoryValidator } = require("../../validators/category");
const { updateMany } = require("../../models/Users");

exports.createSubCategory = async (req, res, next) => {
  try {
    let { title, slug, parent, description, filters } = req.body;

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

    const parentCheck = await ParentCategory.findById(parent);

    if (!parentCheck) {
      return errorResponse(res, 400, "Parent ID is not correct !!");
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
      message: "SubCategory created successfully :))",
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllSubCategories = async (req, res, next) => {
  try {
    const categories = await SubCategory.find();

    return successResponse(res, 200, { categories });
  } catch (err) {
    next(err);
  }
};

exports.getSubCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    if (!isValidObjectId(categoryId)) {
      return errorResponse(res, 400, "Category ID is not correct !!");
    }

    const category = await SubCategory.findOne({ _id: categoryId });

    if (!category) {
      return errorResponse(res, 404, "SubCategory not found !!");
    }

    return successResponse(res, 200, { category });
  } catch (err) {
    next(err);
  }
};
exports.deleteSubCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    if (!isValidObjectId(categoryId)) {
      return errorResponse(res, 400, "Wrong Category ID !!");
    }
    const deletedSubCategory = await SubCategory.findByIdAndDelete(categoryId);
    if (!deletedSubCategory) {
      return errorResponse(res, 404, "Sub Category Not Found!!");
    }
    return successResponse(res, 200, {
      message: "Sub Category Deleted Successfully",
      category: deletedSubCategory,
    });
  } catch (err) {
    next(err);
  }
};

exports.editSubCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    let { title, slug, parent, description, filters } = req.body;

    await subCategoryValidator(
      { title, slug, parent, description, filters },
      { abortEarly: false },
    );
    if (!isValidObjectId(categoryId)) {
      return errorResponse(res, 400, "Category ID is Not Correct !!");
    }

    const parentCheck = await ParentCategory.findById(parent);
    if (!parentCheck) {
      return errorResponse(res, 400, "Parent ID is not correct !!");
    }
    const UpdatedCategory = await SubCategory.findOneAndUpdate(categoryId, {
      title,
      slug,
      parent,
      description,
      filters,
    });
    if (!UpdatedCategory) {
      return errorResponse(res, 404, "Subcategory Not Found !!");
    }
    return successResponse(res, 200, {
      category: UpdatedCategory,
      message: "Category Updated Successfully",
    });
  } catch (err) {
    next();
  }
};
