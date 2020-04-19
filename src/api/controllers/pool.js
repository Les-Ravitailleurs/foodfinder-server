const Joi = require("@hapi/joi");

const ServicePool = require("../../service/pool");

const createPool = async (req, res) => {
  const schema = Joi.object({
    poolName: Joi.string().min(3).max(30),
    creatorName: Joi.string().min(3).max(30).required(),
    creatorEmail: Joi.string().email().required(),
  });
  const { value, error } = schema.validate(req.body);

  if (error) return res.status(400).json({ error });
  const newPool = await ServicePool.createPool(value);
  res.json(newPool);
};

const getPool = async (req, res) => {
  const { poolId } = req.params;
  const { adminId } = req.query;
  const pool = await ServicePool.getPool(poolId, true);
  if (!pool) return res.status(404).json({ error: "Pool not found" });
  if (pool.adminId === adminId) {
    pool.setDataValue("admin", true);
  } else {
    pool.setDataValue("admin", false);
    pool.setDataValue("adminId", undefined);
  }
  res.json(pool);
};

module.exports = { createPool, getPool };
