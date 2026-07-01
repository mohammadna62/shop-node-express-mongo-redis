const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../../helpers/responses");
const { createNoteValidator } = require("../../validators/note");
const Note = require("./../../models/Note");
const Product = require("./../../models/Product");

exports.addNote = async (req, res, next) => {
  try {
    const { productId, content } = req.body;
    const user = req.user;
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 404, "Product Not Found");
    }
    const validatedNoteData = await createNoteValidator.validate(
      { content },
      { abortEarly: false },
    );

    const existingNode = await Note.findOne({
      user: user._id,
      product: productId,
    });
    if (existingNode) {
      return errorResponse(
        res,
        400,
        "Another Note already exist for this product ",
      );
    }
    const newNote = await Note.create({
      user: user._id,
      product: productId,
      content: validatedNoteData.content,
    });
    return successResponse(res, 201, {
      message: "Note created successfully",
      note: newNote,
    });
  } catch (err) {
    next(err);
  }
};

exports.getNote = async (req, res, next) => {
  try {
    const user = req.user;
    const { noteId } = req.params;
    if (!isValidObjectId(noteId)) {
      return errorResponse(res, 400, "Invalid Note Id");
    }
    const note = await Note.findById(noteId).populate("user").populate("product").lean()
    if (note?.user?._id.toString() !== user._id.toString()) {
      return errorResponse(
        res,
        404,
        "Note not found or You have not access to this Note",
      );
    }
    if (!note.product) {
      await Note.findByIdAndDelete(noteId);
      return errorResponse(res, 404, "This Product has been removed !!");
    }
    const product = {
        ...note.product,
        note:{
            _id : note._id,
            content :note.content,
        }
    }
    return successResponse(res , 200 , {product})
  } catch (err) {
    next(err);
  }
};

exports.editNote = async (req, res, next) => {
  try {
    //*Todo
  } catch (err) {
    next(err);
  }
};

exports.removeNote = async (req, res, next) => {
  try {
    //*Todo
  } catch (err) {
    next(err);
  }
};
