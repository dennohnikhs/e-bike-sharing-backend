// models/Bike.js
const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    gpsModuleId: {
      type: String,
      required: true,
      unique: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    currentLocation: {
      latitude: {
        type: Number,
        required: false,
      },
      longitude: {
        type: Number,
        required: false,
      },
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance", "lost"],
      default: "available",
    },
    batteryLevel: {
      type: Number,
      default: 100, // if your GPS or bike tracks battery
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bike", bikeSchema);
