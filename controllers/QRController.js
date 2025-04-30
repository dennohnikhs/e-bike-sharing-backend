const QRCode = require("qrcode");
const Bike = require("../models/Bike");

const generateBikeQR = async (req, res) => {
  try {
    const bikes = await Bike.find({});
    const qrPromises = bikes.map(async (bike) => {
      const qrData = JSON.stringify({
        bikeUuid: bike.uuid,
        bikeName: bike.name,
      });

      const qrCode = await QRCode.toDataURL(qrData);
      return {
        bikeName: bike.name,
        bikeUuid: bike.uuid,
        qrCode,
      };
    });

    const qrCodes = await Promise.all(qrPromises);

    res.status(200).json({
      status: "success",
      data: qrCodes,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error generating QR codes",
      error: error.message,
    });
  }
};

module.exports = { generateBikeQR };
