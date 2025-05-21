const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  try {
    const { bikeUuid } = req.body;
    const userId = req.user._id; // From auth middleware

    if (!bikeUuid) {
      return res.status(400).json({ message: "Bike UUID is required" });
    }

    const booking = new Booking({
      startTime: Date.now(),
      status: "active",
      uuid: bikeUuid, // Assuming bikeUuid is the unique identifier for the booking
      // You might want to generate a unique UUID here instead
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
    const bookings = await Booking.find({ user: req.user._id });
    // .populate("bike")
    // .sort("-createdAt");
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort("-createdAt");

    // .populate("bike")
    // .populate("user")
    res.json({ success: true, data: bookings });
    // sort bookings by createdAt
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const editBikeBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      // Assuming you want to update the status of the booking
      // and not the bike itself
      { new: true }
    );
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  completeBooking,
  editBikeBookingStatus,
  getMyBookings,
  getAllBookings,
};
