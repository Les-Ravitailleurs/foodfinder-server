const logger = require("../logger");
const { Donation } = require("../db");

const createDonation = async ({
  id: stripePaymentIntentId,
  amount,
  metadata,
}) => {
  const { name, email, poolId } = metadata;
  logger.info(
    `Received a donation of amount=${amount} for poolId=${poolId} by name=${name} email=${email}`
  );
  await Donation.create({ stripePaymentIntentId, poolId, amount, name, email });
  return;
};
module.exports = { createDonation };
