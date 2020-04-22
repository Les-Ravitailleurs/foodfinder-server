const Config = require("../config");
const logger = require("../logger");
const { Donation, Pool } = require("../db");
const { sendEmail } = require("../email/email");

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
  const pool = await Pool.findByPk(poolId);
  if (!pool) throw new Error("POOL NOT FOUND");
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
    __BASE_COUNT__: mealCount,
    __GREEN_COUNT__: mealCount,
    __POOL_CREATOR_NAME__: pool.creatorName,
    __LINK__: `${Config.BASE_URL}/collecte/${poolId}`,
    __CREATE_LINK__: `${Config.BASE_URL}?collecte=creer`,
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

module.exports = {
  createDonation,
  getDonation,
  getPoolDonations,
  getDonatorCount,
};
