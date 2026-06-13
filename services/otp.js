require("dotenv").config();
const request = require("request");

exports.sendSms = (phone, otp) => {
  return new Promise((resolve, reject) => {
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
          inputData: [{ "verification-code": otp }],
        },
        json: true,
      },
      (error, response, body) => {
        if (error) {
          return reject(error);
        }

        if (response.statusCode !== 200) {
          return reject(body);
        }

        if (
          typeof body !== "number" &&
          Number(body?.[0]) !== 0
        ) {
          return resolve(body[1]);
        }

        return resolve("OTP Code Send Successfully");
      }
    );
  });
};