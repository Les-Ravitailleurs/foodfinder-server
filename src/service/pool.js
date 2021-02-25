const slugify = require("slugify");
const Config = require("../config");
const { nanoid } = require("nanoid");
const { Pool, Donation, Sequelize, Op } = require("../db");
const { sendEmail } = require("../email/email");

const findIdForPool = async (creatorName) => {
  // ID must be < 21 chars
  const initialSlug = slugify(creatorName, { lower: true }).slice(0, 21);
  if (initialSlug.length < 2) return nanoid();
  let slug = initialSlug;
  let poolExists = await Pool.findByPk(slug);
  let count = 1;
  while (poolExists) {
    const countString = `${count}`;
    const slicedSlug = slug.slice(0, 21 - 1 - countString.length);
    slug = `${slicedSlug}-${count}`;
    poolExists = await Pool.findByPk(slug);
    count += 1;
  }
  return slug;
};

const createOrEditPool = async ({
  poolName,
  creatorName,
  creatorEmail,
  message,
  poolId,
  adminId,
}) => {
  if (poolId) {
    const pool = await Pool.findByPk(poolId);
    if (!adminId || pool.adminId !== adminId) {
      throw new Error("Wrong admin id");
    }
    await pool.update({ creatorName, creatorEmail, message });
    return Pool.findByPk(poolId);
  } else {
    // Let's find last donation by this email
    const lastDonation = await Donation.findOne({
      where: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("email")),
        Sequelize.fn("lower", creatorEmail)
      ),
      order: [["createdAt", "DESC"]],
    });
    const pool = await Pool.create({
      id: await findIdForPool(creatorName),
      creatorName,
      creatorEmail,
      poolName,
      adminId: nanoid(),
      startAt: lastDonation ? lastDonation.mealCount : 0,
    });
    sendEmail("collecte", creatorEmail, {
      __LINK__: `${Config.BASE_URL}/collecte/${pool.id}`,
      __ADMIN_LINK__: `${Config.BASE_URL}/collecte/${pool.id}/admin/${pool.adminId}`,
      __NAME__: creatorName,
    });
    return pool;
  }
};

const getPool = async (poolId, admin = false) => {
  const pool = await Pool.findByPk(poolId);
  if (!pool) return null;

  const mealCount = await Donation.sum("mealCount", {
    where: { poolId: pool.id, createdAt: { [Op.gt]: "2020-12-31 23:59:59" } },
  });
  const mealCountInitial = Number.isNaN(mealCount) ? 0 : mealCount;
  pool.setDataValue("mealCount", mealCountInitial + 8125);
  if (!admin) pool.setDataValue("adminId", undefined);
  return pool;
};

module.exports = { createOrEditPool, getPool };
