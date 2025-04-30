// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("mongo uri", process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
