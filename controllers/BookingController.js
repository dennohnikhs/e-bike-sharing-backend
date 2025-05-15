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

module.exports = {
  createBooking,
  completeBooking,
  getMyBookings,
};
