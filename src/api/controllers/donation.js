const Joi = require("@hapi/joi");

const ServicePool = require("../../service/pool");
const ServiceDonation = require("../../service/donation");
const ServicePayment = require("../../service/payment");

const donate = async (req, res) => {
  const schema = Joi.object({
    donatorName: Joi.string().min(1).max(30).required(),
    donatorAddress: Joi.string().min(1).max(100).required(),
    hideDonatorName: Joi.bool(),
    mealCount: Joi.number().integer().required(),
    poolId: Joi.string().required(),
    volunteerId: Joi.string(),
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

const saveEmail = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    poolId: Joi.string().required(),
    mealCount: Joi.number().integer().required(),
  });
  const { value, error } = schema.validate(req.body);

  if (error) return res.status(400).json({ error });

  await ServiceDonation.saveEmail(value);
  res.send({ message: "Done" });
};

module.exports = { donate, getDonation, saveEmail };
