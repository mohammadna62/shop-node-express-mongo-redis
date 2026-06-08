const redis = require("./../../redis");
const { errorResponse, successResponse } = require("../../helpers/responses");
const Ban = require("./../../models/Ban");

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

//* Finish Helper Functions

exports.send = async (req, res, next) => {
  try {
    const { phone } = req.body;
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
