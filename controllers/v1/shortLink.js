const { errorResponse } = require("../../helpers/responses");
const Product = require("./../../models/Product")
exports.redirectProduct = async (req, res, next) => {
  try {
    const {shortIdentifier} = req.params
    const product = await Product.findOne({shortIdentifier})
    if(!product) {
        return errorResponse(res , 404 , "Product Not Found")
    }
    return res.redirect(`/api/v1/products/${product._id}`)
    
  } catch (err) {
    next(err);
  }
};
