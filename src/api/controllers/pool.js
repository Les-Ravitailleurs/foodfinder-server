const Joi = require("@hapi/joi");

const ServicePool = require("../../service/pool");
const ServiceDonation = require("../../service/donation");
const ServiceVolunteer = require("../../service/donationVolunteer");

const createOrEditPool = async (req, res) => {
  const schema = Joi.object({
    poolId: Joi.string().allow(null).allow("").optional(),
    adminId: Joi.string().allow(null).allow("").optional(),
    message: Joi.string().allow(null).allow("").optional(),
    creatorName: Joi.string().min(2).max(30).required(),
    creatorEmail: Joi.string().email().required(),
  });
  const { value, error } = schema.validate(req.body);

  if (error) return res.status(400).json({ error });
  try {
    const newPool = await ServicePool.createOrEditPool(value);
    res.json(newPool);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const getPool = async (req, res) => {
  const { poolId } = req.params;
  const { adminId, volunteer: volunteerUsername } = req.query;
  const pool = await ServicePool.getPool(poolId, true);
  if (!pool) return res.status(404).json({ error: "Pool not found" });
  if (pool.adminId === adminId) {
    pool.setDataValue("admin", true);
  } else {
    pool.setDataValue("admin", false);
    pool.setDataValue("adminId", undefined);
  }
  if (volunteerUsername) {
    const volunteer = await ServiceVolunteer.getVolunteerByUsername(
      volunteerUsername
    );
    pool.setDataValue("volunteer", volunteer);
  }
  const allDonations = await ServiceDonation.getPoolDonations(poolId);
  const recentDonations = await ServiceDonation.getRecentPoolDonations(poolId);
  const donationsNames = allDonations
    .filter((d) => d.hideDonatorName === false)
    .map((d) => d.name);
  if (pool.startAt > 0) {
    donationsNames.unshift(pool.creatorName);
  }
  pool.setDataValue("donationsNames", donationsNames);
  pool.setDataValue("donationsCount", recentDonations.length);
  res.json(pool);
};

module.exports = { createOrEditPool, getPool };
