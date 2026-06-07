const { default: mongoose } = require("mongoose");

const banScheme = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Ban", banScheme);
