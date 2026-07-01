const { errorResponse, successResponse } = require("../../helpers/responses");
const Note = require("./../../models/Note");
const Product = require("./../../models/Product")

exports.addNote = async (req, res, next) => {
  try {
    const { productId, content } = req.body;
    const user = req.user;
    const product = await Product.findById(productId)
    if(!product){
        return errorResponse(res, 404 , "Product Not Found")
    }
    //Todo validator
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
      content,
    });
    return successResponse(res , 201 , {message: "Note created successfully", note:newNote})
  } catch (err) {
    next(err);
  }
};

exports.getNote = (req, res, next) => {
  try {
    const { noteId } = res.params;
  } catch (err) {
    next(err);
  }
};

exports.editNote = (req, res, next) => {
  try {
    //*Todo
  } catch (err) {
    next(err);
  }
};

exports.removeNote = (req, res, next) => {
  try {
    //*Todo
  } catch (err) {
    next(err);
  }
};
