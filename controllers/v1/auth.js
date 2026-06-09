const redis = require("./../../redis");
const { errorResponse, successResponse } = require("../../helpers/responses");
const Ban = require("./../../models/Ban");
const bcrypt = require("bcrypt");
const { sendSms } = require("../../services/otp");

//* Start Helper Functions

function getOtpRedisPattern(phone) {
  return `otp:${phone}`;
}
async function getOtpDetails(phone) {
  const otp = await redis.get(getOtpRedisPattern(phone));
  if (!otp) {
    return {
      expired: true,
      remainingTime: 0,
    };
  }
  const remainingTime = await redis.ttl(getOtpRedisPattern(phone)); //Second
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return {
    expired: false,
    remainingTime: formattedTime,
  };
}
const generateOtp = async (phone, length = 4, expireTime = 1) => {
  const digit = `0123456789`;
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digit[Math.random() * digit.length];
  }
  const hashedOtp = await bcrypt.hash(otp, 12);
  await redis.set(getOtpRedisPattern(phone), hashedOtp, "EX", expireTime * 60);
  return otp;
};
//* Finish Helper Functions

exports.send = async (req, res, next) => {
  try {
    const { phone } = req.body;
    console.log("phone");
    return res.json("ok")
    const isBanned = await Ban.findOne({ phone });
    if (isBanned) {
      return errorResponse(res, 403, "This Phone Number has been banned ");
    }
    //*Validation
    const { expired, remainingTime } = await getOtpDetails(phone);
    if (!expired) {
      return successResponse(res, 200, {
        message: `OTP Already Send Please Tray Again After ${remainingTime}`,
      });
    }
    const otp = generateOtp(phone);
    await sendSms(phone, otp);
    return successResponse(res, 200, { message: "OTP Send Successfully" });
  } catch (err) {
    next(err);
  }
};

exports.verify = async (req, res, next) => {
  //Code
};

exports.getMe = async (req, res, next) => {
  //Code
};
