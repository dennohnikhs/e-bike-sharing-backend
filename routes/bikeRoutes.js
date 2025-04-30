const express = require("express");
const { protect } = require("../middlewares/authMiddlewares");
const {
  addBike,
  getAllBikes,
  getBikeById,
  searchBikeByQRCode,
  updateBike,
} = require("../controllers/BikeController");

const router = express.Router();

router.post("/", protect, addBike);
router.get("/", getAllBikes);
router.get("/:id", getBikeById);

module.exports = router;
