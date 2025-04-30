// routes/authRoutes.js
const express = require("express");
const { getAllUsers } = require("../controllers/UsersControllers");
const router = express.Router();

// router.get("/users", getAllUsers);

module.exports = router;
