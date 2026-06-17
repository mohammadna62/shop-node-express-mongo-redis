const { default: mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  description: {
    type: String,
    trim: true,
  },
  icon: {
    type: {
      filename: {
        type: String,
        require: true,
        trim: true,
      },
      path:{
        type: String,
        require: true,
        trim: true,
      },
    },
  },
});

module.exports = mongoose.model("Category", categorySchema);
