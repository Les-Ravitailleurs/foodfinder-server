const Config = require("../config");
const logger = require("../logger");
const { Donation, SavedEmail, sequelize } = require("../db");
const { sendEmail } = require("../email/email");
const ServicePool = require("./pool");
const ServiceDonationVolunteer = require("./donationVolunteer");
const ServiceTaxReceipt = require("./taxReceipt/index");
const moment = require("moment-timezone");

const createDonation = async ({
  id: stripePaymentIntentId,
  amount,
  metadata,
  charges,
}) => {
  // Get pool id from metadata
  const {
    poolId,
    donationId,
    mealCount,
    donatorName,
    donatorAddress,
    hideDonatorName,
    taxReceiptId,
    volunteerId,
  } = metadata;
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
  const year = moment().tz("Europe/Paris").format("YY");
  const receiptCountForYearQuery = await sequelize.query(
    `SELECT COUNT(id) FROM donations WHERE "taxReceiptNumber" != '' AND date_part('year', "createdAt") = date_part('year', CURRENT_DATE);`
  );
  const receiptCountForYear = parseInt(
    receiptCountForYearQuery[0][0].count,
    10
  );
  const number = `0000${receiptCountForYear + 1}`.slice(-5);
  const taxReceiptNumber = `CO${year}-${number}`;
  // Create tax receipt with id
  const donation = await Donation.create({
    id: donationId,
    stripePaymentIntentId,
    poolId,
    amount,
    stripeName: name,
    email: email.toLowerCase(),
    mealCount,
    name: donatorName,
    donatorAddress,
    hideDonatorName,
    taxReceiptId,
    taxReceiptNumber,
    volunteerId,
  });

  logger.info(
    `Generating tax receipt with number=${taxReceiptNumber} and id=${taxReceiptId}...`
  );

  const {
    taxReceiptURL,
    taxReceiptBase64,
  } = await ServiceTaxReceipt.generateTaxReceiptAndUpload({
    taxReceiptId,
    taxReceiptNumber,
    donatorName,
    donatorAddress,
    amount,
  });
  await donation.update({ taxReceiptURL });
  sendEmail(
    "donation",
    email,
    {
      __NAME__: donatorName,
      __MEAL_COUNT__: mealCount,
      __PACKAGING_COUNT__: mealCount,
      __BASE_COUNT__: (mealCount * 0.25).toFixed(1),
      __GREEN_COUNT__: (mealCount * 0.15).toFixed(1),
      __POOL_CREATOR_NAME__: pool.creatorName,
      __LINK__: `${Config.BASE_URL}/collecte/`,
      // __CREATE_LINK__: `${Config.BASE_URL}?collecte=creer`,
    },
    {
      ContentType: "application/pdf",
      Filename: `ravitailleurs_recu_fiscal_${taxReceiptNumber}.pdf`,
      Base64Content: taxReceiptBase64,
    }
  );
  // If donation has a volunteer, send email
  if (volunteerId) {
    const volunteer = await ServiceDonationVolunteer.getVolunteerById(
      volunteerId
    );
    if (volunteer) {
      const volunteerDonationsTotal = await ServiceDonationVolunteer.getDonationsById(
        volunteerId
      );
      sendEmail("donation_volunteer", volunteer.email, {
        __VOLUNTEER_NAME__: volunteer.name,
        __TOTAL_MEAL_COUNT__:
          parseInt(pool.getDataValue("mealCount")) +
          pool.startAt +
          parseInt(mealCount),
        __MEAL_COUNT__: mealCount,
        __DONATOR_NAME__: donatorName,
        __TOTAL_VOLUNTEER_MEAL_COUNT__: volunteerDonationsTotal,
        __LINK__: `${Config.BASE_URL}/collecte/?rav=${volunteer.username}`,
        __DASHBOARD_LINK__: `${Config.BASE_URL}/dashboard?token=${volunteerId}`,
      });
    }
  }
  // sendEmail("donation_admin", pool.creatorEmail, {
  //   __DONATOR_NAME__: donatorName,
  //   __TOTAL_MEAL_COUNT__:
  //     parseInt(pool.getDataValue("mealCount")) +
  //     pool.startAt +
  //     parseInt(mealCount),
  //   __MEAL_COUNT__: mealCount,
  //   __POOL_CREATOR_NAME__: pool.creatorName,
  //   __LINK__: `${Config.BASE_URL}/collecte/`,
  //   // __ADMIN_LINK__: `${Config.BASE_URL}/collecte/${poolId}/admin/${pool.adminId}`,
  // });
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
