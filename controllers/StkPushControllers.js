const axios = require("axios");
const { CONSUMER_KEY, CONSUMER_SECRET, SHORTCODE, PASSKEY, CALLBACK_URL } =
  process.env;

const getTimeStamp = () => {
  const date = new Date();
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(date.getDate()).padStart(2, "0")}${String(
    date.getHours()
  ).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
};

const getPassword = (timestamp) => {
  const password = `${SHORTCODE}${PASSKEY}${timestamp}`;
  return Buffer.from(password).toString("base64");
};

const getAccessToken = async () => {
  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString(
    "base64"
  );

  const response = await axios.get(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  return response.data.access_token;
};

exports.sendStkPush = async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;
    if (!phoneNumber || !amount)
      return res
        .status(400)
        .json({ error: "Phone number and amount are required" });

    let formattedPhone = phoneNumber.startsWith("0")
      ? phoneNumber.replace("0", "254")
      : phoneNumber.startsWith("+")
      ? phoneNumber.replace("+", "")
      : phoneNumber;

    const timestamp = getTimeStamp();
    const password = getPassword(timestamp);
    const accessToken = await getAccessToken();

    const stkPayload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: CALLBACK_URL,
      AccountReference: "Test123",
      TransactionDesc: "Pay Money to Nairobi Ebike Masters",
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: "STK Push request sent successfully",
      response: response.data,
    });
  } catch (error) {
    console.error("STK Push Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.handleCallback = (req, res) => {
  console.log("STK Callback received:", JSON.stringify(req.body));
  const callbackData = req.body.Body.stkCallback;

  res.json({ ResultCode: 0, ResultDesc: "Accepted" });

  if (callbackData.ResultCode === 0) {
    const details = callbackData.CallbackMetadata.Item;
    console.log("✅ Payment successful:", details);
  } else {
    console.log("❌ Payment failed:", callbackData.ResultDesc);
  }
};
