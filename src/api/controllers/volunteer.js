const ServiceVolunteer = require("../../service/volunteer");

const getDeliveryData = async (req, res) => {
  const { volunteerId } = req.params;

  const deliveryData = await ServiceVolunteer.getDeliveryData(volunteerId);
  res.json(deliveryData);
};

module.exports = { getDeliveryData };
