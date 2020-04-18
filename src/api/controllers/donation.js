const Joi = require("@hapi/joi");

const ServicePool = require("../../service/pool");
const ServicePayment = require("../../service/payment");

const donate = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
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

module.exports = { donate };
