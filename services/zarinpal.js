exports.createPayment = async function ({ amountInRial, description, mobile }) {
  try {
    const response = await fetch(process.env.ZARINPAL_API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        callback_url: process.env.ZARINPAL_PAYMENT_CALLBACK_URL,
        amount: amountInRial,
        description,
        metadata: {
          mobile,
        },
      }),
    });
    const data = await response.json();
    return {
      authority: data.data.authority,
      paymentUrl: process.env.ZARINPAL_PAYMENT_BASE_URL + data.data.authority,
    };
  } catch (err) {
    next(err);
  }
};

exports.verifyPayment = async function () {};
