const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/UsersControllers");
const {
  addBike,
  getAllBikes,
  searchBikeByQRCode,
  updateBike,
} = require("../controllers/BikeController");
const { protect } = require("../middlewares/authMiddlewares");
const { generateBikeQR } = require("../controllers/QRController");
const router = express.Router();

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.post("/add-bike", protect, addBike);
router.get("/bikes", protect, getAllBikes);
router.get("/qr/:uuid", searchBikeByQRCode);
router.get("/generate-bike-qr", generateBikeQR);

module.exports = router;
