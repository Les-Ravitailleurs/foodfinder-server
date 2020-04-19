const { nanoid } = require("nanoid");
const { Pool, Donation, Sequelize } = require("../db");

const createPool = async ({ poolName, creatorName, creatorEmail }) => {
  // Let's find last donation by this email
  const lastDonation = await Donation.findOne({
    where: Sequelize.where(
      Sequelize.fn("lower", Sequelize.col("email")),
      Sequelize.fn("lower", creatorEmail)
    ),
    order: [["createdAt", "DESC"]],
  });
  return Pool.create({
    creatorName,
    creatorEmail,
    poolName,
    adminId: nanoid(),
    startAt: lastDonation ? lastDonation.mealCount : 0,
  });
};

const getPool = async (poolId, admin = false) => {
  const pool = await Pool.findByPk(poolId);
  if (!pool) return null;
  const mealCount = await Donation.sum("mealCount", {
    where: { poolId: pool.id },
  });
  pool.setDataValue("mealCount", Number.isNaN(mealCount) ? 0 : mealCount);
  if (!admin) pool.setDataValue("adminId", undefined);
  return pool;
};

module.exports = { createPool, getPool };
