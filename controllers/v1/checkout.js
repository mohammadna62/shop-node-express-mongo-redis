const { createPayment } = require("../../services/zarinpal")


exports.createCheckout= async(req , res , next)=>{
    try {
       const payment = createPayment({
            amountInRial:10000,
            description: "سفارش با شناسه 12213459",
            mobile:"09124456658"
        })
        return res.json(payment)
    } catch (err) {
        next(err)
    }
}

exports.verifyCheckout= async(req , res , next)=>{
    try {
        //Codes
    } catch (err) {
        next(err)
    }
}
