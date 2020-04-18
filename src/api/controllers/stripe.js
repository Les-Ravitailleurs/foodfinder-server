const ServiceDonation = require("../../service/donation");

const webhook = async (req, res) => {
  const { type, data } = req.body;
  if (type !== "payment_intent.succeeded") return res.send({});
  const { object: checkoutObject } = data;
  await ServiceDonation.createDonation(checkoutObject);
  res.send({});
};

module.exports = { webhook };
