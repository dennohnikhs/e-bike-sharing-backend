const express = require("express");
const { protect } = require("../middlewares/authMiddlewares");
const {
  addBike,
  getAllBikes,
  getBikeById,
  searchBikeByQRCode,
  updateBike,
  getBikeByUuid,
} = require("../controllers/BikeController");

const router = express.Router();

router.post("/", protect, addBike);
router.get("/", getAllBikes);
router.get("/:uuid", getBikeByUuid);

module.exports = router;
