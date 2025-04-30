const express = require("express");
const { protect } = require("../middlewares/authMiddlewares");
const {
  createBooking,
  getMyBookings,
  payMpesa,
} = require("../controllers/BookingController");
const { updateBike } = require("../controllers/BikeController");
const { userAuthMiddleware } = require("../middlewares/userAuthMiddleware");

const router = express.Router();

// Protect all routes
router.use(protect);

// Use the handlers with proper middleware
router.post("/book", userAuthMiddleware, createBooking);
router.get("/my-bookings", userAuthMiddleware, getMyBookings);
router.patch("/edit-bike/:uuid", updateBike);
router.post("/pay-mpesa", payMpesa);

module.exports = router;
