const Bike = require("../models/Bike");

const getAllBikesAdmin = async (req, res) => {
  try {
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

const updateBikeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bike = await Bike.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
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
      message: "Error updating bike status",
      error: error.message,
    });
  }
};

module.exports = { getAllBikesAdmin, updateBikeStatus };
