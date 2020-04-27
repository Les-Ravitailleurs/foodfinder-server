const Config = require("../config");
const logger = require("../logger");
const { Donation, SavedEmail } = require("../db");
const { sendEmail } = require("../email/email");
const ServicePool = require("./pool");

const createDonation = async ({
  id: stripePaymentIntentId,
  amount,
  metadata,
  charges,
}) => {
  // Get pool id from metadata
  const { poolId, donationId, mealCount, donatorName } = metadata;
  // Get donator email & name from charge
  const charge = charges.data.find((c) => c.captured === true);
  const { email, name } = charge.billing_details;
  logger.info(
    `Received a donation of mealCount=${mealCount} for poolId=${poolId} by name=${name} email=${email}`
  );
  const pool = await ServicePool.getPool(poolId, true);
  if (!pool) throw new Error("POOL NOT FOUND");
  const alreadyDonation = await Donation.findOne({
    where: { stripePaymentIntentId },
  });
  if (alreadyDonation) {
    return logger.warn(`Payment ${stripePaymentIntentId} already received`);
  }
  await Donation.create({
    id: donationId,
    stripePaymentIntentId,
    poolId,
    amount,
    stripeName: name,
    email: email.toLowerCase(),
    mealCount,
    name: donatorName,
  });
  sendEmail("donation", email, {
    __NAME__: donatorName,
    __MEAL_COUNT__: mealCount,
    __PACKAGING_COUNT__: mealCount,
    __BASE_COUNT__: (mealCount * 0.25).toFixed(1),
    __GREEN_COUNT__: (mealCount * 0.15).toFixed(1),
    __POOL_CREATOR_NAME__: pool.creatorName,
    __LINK__: `${Config.BASE_URL}/collecte/${poolId}`,
    __CREATE_LINK__: `${Config.BASE_URL}?collecte=creer`,
  });
  sendEmail("donation_admin", pool.creatorEmail, {
    __DONATOR_NAME__: donatorName,
    __TOTAL_MEAL_COUNT__:
      parseInt(pool.getDataValue("mealCount")) +
      pool.startAt +
      parseInt(mealCount),
    __MEAL_COUNT__: mealCount,
    __POOL_CREATOR_NAME__: pool.creatorName,
    __LINK__: `${Config.BASE_URL}/collecte/${poolId}`,
    __ADMIN_LINK__: `${Config.BASE_URL}/collecte/${poolId}/admin/${pool.adminId}`,
  });
  return;
};

const getDonation = async ({ donationId }) => {
  const donation = await Donation.findByPk(donationId);
  return donation;
};

const getPoolDonations = async (poolId) =>
  Donation.findAll({ where: { poolId }, order: [["createdAt", "ASC"]] });

const getDonatorCount = () =>
  Donation.aggregate("email", "count", { distinct: true });

const saveEmail = ({ poolId, name, email, mealCount }) =>
  SavedEmail.create({ poolId, name, email, mealCount });

module.exports = {
  createDonation,
  getDonation,
  getPoolDonations,
  getDonatorCount,
  saveEmail,
};
