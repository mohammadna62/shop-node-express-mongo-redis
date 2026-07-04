const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
  },{timestamps:true}
);

module.exports = mongoose.model("Note", noteSchema);
