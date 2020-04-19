const logger = require("../logger");
const { Donation } = require("../db");

const createDonation = async ({
  id: stripePaymentIntentId,
  amount,
  metadata,
  charges,
}) => {
  // Get pool id from metadata
  const { poolId, donationId, mealCount } = metadata;
  // Get donator email & name from charge
  const charge = charges.data.find((c) => c.captured === true);
  const { email, name } = charge.billing_details;
  logger.info(
    `Received a donation of mealCount=${mealCount} for poolId=${poolId} by name=${name} email=${email}`
  );
  await Donation.create({
    id: donationId,
    stripePaymentIntentId,
    poolId,
    amount,
    name,
    email,
    mealCount,
  });
  return;
};

const getDonation = async ({ donationId }) => {
  const donation = await Donation.findByPk(donationId);
  return donation;
};

module.exports = { createDonation, getDonation };
