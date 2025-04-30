const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "in-use", "maintenance"],
      default: "available",
    },
    location: {
      type: {
        latitude: Number,
        longitude: Number,
      },
      required: true,
    },
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    lastMaintenance: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bike", bikeSchema);
