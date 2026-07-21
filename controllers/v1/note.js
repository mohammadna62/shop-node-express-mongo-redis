const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../../helpers/responses");
const {
  createNoteValidator,
  editNoteValidator,
} = require("../../validators/note");
const Note = require("./../../models/Note");
const Product = require("./../../models/Product");
const { createPaginationData } = require("../../utils/index");

exports.getNotes = async (req, res, next) => {
  try {
    user = req.user;
    const { page = 1, limit = 10 } = req.query;
    const notes = await Note.find({ user: user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "product",
      })
      .lean();
    let notedProducts = [];
    for (const note of notes) {
      if (note.product) {
        const product = {
          ...note.product,
          note: note._id,
          content: note.content,
          createdAt: note.createdAt,
        };
        notedProducts.push(product);
      } else {
        await Note.findOneAndDelete({ _id: note._id });
      }
    }
    if (!notes) {
      return errorResponse(res, 404, "No Notes Found");
    }
    const userTotalNote = await Note.countDocuments({ user: user._id });
    return successResponse(res, 200, {
      products: notedProducts,
      pagination: createPaginationData(+page, +limit, userTotalNote, "Notes"),
    });
  } catch (err) {
    next(err);
  }
};

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
        "Note Already Exists for This Product",
      );
    }
    const newNote = await Note.create({
      user: user._id,
      product: productId,
      content: validatedNoteData.content,
    });
    return successResponse(res, 201, {
      message: "Note Created Successfully",
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
      return errorResponse(res, 400, "Invalid Note ID");
    }
    const note = await Note.findById(noteId)
      .populate("user")
      .populate("product")
      .lean();
    if (note?.user?._id.toString() !== user._id.toString()) {
      return errorResponse(
        res,
        404,
        "Note Not Found or Access Denied",
      );
    }
    if (!note.product) {
      await Note.findByIdAndDelete(noteId);
      return errorResponse(res, 404, "Product Removed Successfully");
    }
    const product = {
      ...note.product,
      note: {
        _id: note._id,
        content: note.content,
        createdAt: note.createdAt,
      },
    };
    return successResponse(res, 200, { product });
  } catch (err) {
    next(err);
  }
};

exports.editNote = async (req, res, next) => {
  try {
    const user = req.user;
    const { noteId } = req.params;
    const { content } = req.body;

    const editValidatedData = await editNoteValidator.validate(
      { content },
      { abortEarly: false },
    );

    if (!isValidObjectId(noteId)) {
      return errorResponse(res, 400, "Invalid Note ID");
    }
    const existingNote = await Note.findById(noteId);

    if (existingNote?.user._id.toString() !== user._id.toString()) {
      return errorResponse(
        res,
        404,
        "Note Not Found or Access Denied",
      );
    }

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      {
        content: editValidatedData.content,
      },
      { new: true },
    );

    return successResponse(res, 200, {
      note: updatedNote,
      message: "Note Updated Successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.removeNote = async (req, res, next) => {
  try {
    const user = req.user;
    const { noteId } = req.params;

    if (!isValidObjectId(noteId)) {
      return errorResponse(res, 400, "Invalid Note ID");
    }

    const existingNote = await Note.findById(noteId);
    if (!existingNote || existingNote.user.toString() !== user._id.toString()) {
      return errorResponse(
        res,
        404,
        "Note Not Found or Access Denied",
      );
    }

    const deletedNote = await Note.findByIdAndDelete(noteId);
    return successResponse(res, 200, {
      message: "Note Removed Successfully",
      note: deletedNote,
    });
  } catch (err) {
    next(err);
  }
};
