const Bike = require("../models/Bike");

const addBike = async (req, res) => {
  try {
    const { uuid, gpsModuleId } = req.body;

    if (!uuid || !gpsModuleId) {
      return res
        .status(400)
        .json({ message: "UUID and GPS Module ID are required" });
    }

    // Check if bike already exists with either UUID or GPS Module ID
    const existingBike = await Bike.findOne({
      $or: [{ uuid }, { gpsModuleId }],
    });

    if (existingBike) {
      return res.status(400).json({
        message: "Bike already exists",
        details:
          existingBike.uuid === uuid
            ? "UUID is already registered"
            : "GPS Module ID is already registered",
      });
    }

    const newBike = new Bike({
      uuid,
      gpsModuleId,
      isAvailable: true,
      status: "available",
    });

    await newBike.save();

    res.status(201).json({ message: "Bike added successfully", bike: newBike });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllBikes = async (req, res) => {
  try {
    // Remove the filter for status to get all bikes
    const bikes = await Bike.find();
    res.status(200).json({
      status: "success",
      data: bikes,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching bikes",
      error: error.message,
    });
  }
};

const getBikeById = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
      return res.status(404).json({
        status: "error",
        message: "Bike not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: bike,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching bike",
      error: error.message,
    });
  }
};

const searchBikeByQRCode = async (req, res) => {
  try {
    const { uuid } = req.params;
    const bike = await Bike.findOne({ uuid });

    if (!bike) {
      return res.status(404).json({
        status: "error",
        message: "Bike not found with this QR code",
      });
    }

    res.status(200).json({
      status: "success",
      data: bike,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error searching for bike",
      error: error.message,
    });
  }
};

const updateBike = async (req, res) => {
  try {
    const { uuid } = req.params;
    const updates = req.body;

    // Validate status if it's being updated
    if (
      updates.status &&
      !["available", "booked", "maintenance", "lost"].includes(updates.status)
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid status value",
      });
    }

    // Update isAvailable based on status
    if (updates.status) {
      updates.isAvailable = updates.status === "available";
    }

    const bike = await Bike.findOneAndUpdate(
      { uuid },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!bike) {
      return res.status(404).json({
        status: "error",
        message: "Bike not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: bike,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating bike",
      error: error.message,
    });
  }
};

module.exports = {
  addBike,
  getAllBikes,
  getBikeById,
  searchBikeByQRCode,
  updateBike,
};
