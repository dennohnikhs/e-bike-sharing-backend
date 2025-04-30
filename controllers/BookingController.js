const Booking = require("../models/Booking");
const axios = require("axios");

const createBooking = async (req, res) => {
  try {
    const { bikeId } = req.body;
    const userId = req.user._id; // From auth middleware

    if (!bikeId) {
      return res.status(400).json({ message: "Bike ID is required" });
    }

    const booking = new Booking({
      bike: bikeId,
      user: userId,
    });

    await booking.save();
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: "completed",
        endTime: Date.now(),
      },
      { new: true }
    );
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("bike")
      .sort("-createdAt");
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAccessToken = async () => {
  const consumerKey = process.env.SAFARICOM_CONSUMER_KEY;
  const consumerSecret = process.env.SAFARICOM_CONSUMER_SECRET;
  const authString = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );

  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${authString}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error generating access token:", error.message);
    throw error;
  }
};

const initiateSTKPush = async (accessToken, phone, amount) => {
  const BUSINESS_SHORT_CODE = process.env.MPESA_BUSINESS_SHORT_CODE;

  const timestamp = getTimestamp();
  const password = Buffer.from(
    BUSINESS_SHORT_CODE + process.env.MPESA_PASS_KEY + timestamp
  ).toString("base64");

  const payload = {
    BusinessShortCode: BUSINESS_SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.MPESA_BUSINESS_SHORT_CODE,
    PhoneNumber: phone,
    CallBackURL: "https://buysasaOnline.com/",
    AccountReference: "BuySasa online shop",
    TransactionDesc: "Payment",
  };

  try {
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};
function parseDate(val) {
  return val < 10 ? "0" + val : val;
}

const getTimestamp = () => {
  const dateString = new Date().toLocaleString("en-us", {
    timeZone: "Africa/Nairobi",
  });
  const dateObject = new Date(dateString);
  const month = parseDate(dateObject.getMonth() + 1);
  const day = parseDate(dateObject.getDate());
  const hour = parseDate(dateObject.getHours());
  const minute = parseDate(dateObject.getMinutes());
  const second = parseDate(dateObject.getSeconds());
  return (
    dateObject.getFullYear() +
    "" +
    month +
    "" +
    day +
    "" +
    hour +
    "" +
    minute +
    "" +
    second
  );
};

const payMpesa = async (req, res) => {
  const { amount, phoneNumber } = req.body;

  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone Number is required" });
  }

  try {
    const accessToken = await getAccessToken();
    console.log("Access token", accessToken);
    await initiateSTKPush(accessToken, phoneNumber, amount);
    res.json({
      success: true,
      message: "Payment successful",
      data: {
        amount,
        phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  completeBooking,
  getMyBookings,
  payMpesa,
};
