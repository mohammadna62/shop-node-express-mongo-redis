const yup = require("yup");

const sendOtpValidator = yup.object({
  phone: yup
    .string()
    .require("Phone Number is Require!! ")
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,"Phone number is not valid"),
});

const otpVerifyValidator = yup.object({
    phone: yup
    .string()
    .require("Phone Number is Require!! ")
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,"Phone number is not valid"),
    otp : yup.string().require("OTP code is Required").matches(/^[0-9]+$/,"OTP code is not valid")
});

module.exports = { sendOtpValidator, otpVerifyValidator };
