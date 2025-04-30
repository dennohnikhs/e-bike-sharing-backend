const express = require("express");
const { getUserProfile } = require("../controllers/UsersControllers");
const router = express.Router();

router.get("/me", getUserProfile);

module.exports = router;
