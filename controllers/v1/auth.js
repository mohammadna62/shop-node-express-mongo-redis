const redis = require("./../../redis");
const { errorResponse, successResponse } = require("../../helpers/responses");
const Ban = require("./../../models/Ban");
const bcrypt = require("bcrypt");
const { sendSms } = require("../../services/otp");
const {
  sendOtpValidator,
  otpVerifyValidator,
} = require("./../../validators/auth");
const User = require("./../../models/Users");
const jwt = require("jsonwebtoken");

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
    otp += digit[Math.floor(Math.random() * digit.length)];
  }
 
  
  const hashedOtp = await bcrypt.hash(otp, 12);
  await redis.set(getOtpRedisPattern(phone), hashedOtp, "EX", expireTime * 60);

  return otp;
};
//* Finish Helper Functions

exports.send = async (req, res, next) => {
  try {
    const { phone } = req.body;
    await sendOtpValidator.validate({ phone }, { abortEarly: false });

    const isBanned = await Ban.findOne({ phone });
    if (isBanned) {
      return errorResponse(res, 403, "This Phone Number has been banned ");
    }

    const { expired, remainingTime } = await getOtpDetails(phone);
    if (!expired) {
      return successResponse(res, 200, {
        message: `OTP Already Send Please Tray Again After ${remainingTime}`,
      });
    }
    const otp = await generateOtp(phone);

    const result = await sendSms(phone, otp, res);
    return successResponse(res, 200, {
      message: "OTP Send Successfully",
      result,
    });
  } catch (err) {
    next(err);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const { phone, otp, isSeller } = req.body;
    await otpVerifyValidator.validate(req.body, { abortEarly: false });
    const savedOtp = await redis.get(getOtpRedisPattern(phone));
    const otpIsCorrect = await bcrypt.compare(otp, savedOtp);
    if (!otpIsCorrect) {
      return errorResponse(res, 400, "Wrong or Expired otp !!");
    }
    if (!otpIsCorrect) {
      return errorResponse(res, 400, "Wrong or Expired otp !!");
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      const token = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        },
      );
      return successResponse(res, 201, { user: existingUser, token });
    }
    const isFirstUser = (await User.countDocuments()) === 0; //* Checked for First User
    const user = await User.create({
      phone,
      username: phone,
      roles: isFirstUser ? ["ADMIN"] : isSeller ? ["USER", "SELLER"] : ["USER"],
    });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    return successResponse(res, 201, {
      message: "User register Successfully",
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
    try {
    const user = req.user;

    return successResponse(res, 200, { user });
  } catch (err) {
    next(err);
  }
};
