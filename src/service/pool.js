const { Pool, Donation } = require("../db");

const createPool = ({ poolName, creatorName, creatorEmail }) =>
  Pool.create({
    creatorName,
    creatorEmail,
    poolName,
  });

const getPool = async (poolId) => {
  const pool = await Pool.findByPk(poolId);
  if (!pool) return null;
  const donationAmount = await Donation.sum("amount", {
    where: { poolId: pool.id },
  });
  pool.setDataValue(
    "donationAmount",
    Number.isNaN(donationAmount) ? 0 : donationAmount
  );
  return pool;
};

module.exports = { createPool, getPool };
