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
    required:true
  },
  description: {
    type: String,
    trim: true,
  },
  
});

module.exports = mongoose.model("SubCategory", categorySchema);
