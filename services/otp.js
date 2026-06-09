require("dotenv");
exports.sendSms = async (phone, opt) => {
  try {
    request.post(
      {
        url: "http://ippanel.com/api/select",
        body: {
          op: "pattern",
          user: process.env.SMS_UNAME,
          pass: process.env.SMS_PASSWORD,
          fromNum: process.env.SMS_FROM,
          toNum: phone,
          patternCode: process.env.VERIFY_PATTERN_CODE,
          inputData: [{ "verification-code": opt }],
        },
        json: true,
      },
      async function (error, response, body) {
        if (!error && response.statusCode === 200) {
          //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE

          if (
            typeof response.body !== "number" &&
            Number(response.body[0]) !== 0
          ) {
            return res.status(500).json({ message: response.body[1] });
          }
          await otpModel.create({ phone, code, expireAt });
          return res
            .status(201)
            .json({ message: "OTP Code Send Successfully" });
        } else {
          console.log("whatever you want");
        }
      },
    );
  } catch (err) {
    console.log("Error ->", err);
  }
};
