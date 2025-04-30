const express = require("express");
const { generateBikeQR } = require("../controllers/QRController");
const router = express.Router();

router.get("/generate-bike-qr", generateBikeQR);

module.exports = router;
