const Joi = require("@hapi/joi");

const ServicePool = require("../../service/pool");
const ServiceDonation = require("../../service/donation");
const ServicePayment = require("../../service/payment");

const donate = async (req, res) => {
  const schema = Joi.object({
    // name: Joi.string().min(3).max(30).required(),
    mealCount: Joi.number().integer().required(),
    poolId: Joi.string().required(),
  });
  const { value, error } = schema.validate(req.body);

  if (error) return res.status(400).json({ error });

  const pool = await ServicePool.getPool(value.poolId);
  if (!pool) return res.status(400).json({ error: "Pool not found" });
  const session = await ServicePayment.createCheckoutSession(value);
  res.send(session);
};

const getDonation = async (req, res) => {
  const schema = Joi.object({
    donationId: Joi.string().required(),
  });
  const { value, error } = schema.validate(req.params);

  if (error) return res.status(400).json({ error });

  const donation = await ServiceDonation.getDonation(value);
  res.send(donation);
};

module.exports = { donate, getDonation };
