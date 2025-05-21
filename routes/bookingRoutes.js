const express = require("express");
const { protect, isAdmin, isUser } = require("../middlewares/authMiddlewares");
const {
  createBooking,
  getMyBookings,
  payMpesa,
  getAllBookings,
  editBikeBookingStatus,
} = require("../controllers/BookingController");
const { updateBike } = require("../controllers/BikeController");
const { sendStkPush } = require("../controllers/StkPushControllers");

const router = express.Router();

// Protect all routes
router.use(protect);

// Use the handlers with proper middleware
router.post("/book-one", protect, isUser, createBooking);
router.get("/all-bookings", protect, isAdmin, getAllBookings);
router.get("/my-bookings/:id", protect, isUser, getMyBookings);
router.patch("/complete-booking/:id", protect, isAdmin, editBikeBookingStatus);
router.patch("/edit-bike/:uuid", updateBike);
router.post("/pay-mpesa", sendStkPush);

module.exports = router;
