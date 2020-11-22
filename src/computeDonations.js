const db = require("./db");

const go = async () => {
  const donations = await db.Donation.findAll({
    order: [["createdAt", "DESC"]],
  });
  const pools = await db.Pool.findAll();
  const donationsByEmail = {};
  const donationsEmailsToRemove = [];
  for (const donation of donations) {
    const email = donation.email.toLowerCase();
    if (donation.taxReceiptNumber) {
      donationsEmailsToRemove.push(email);
    }
    donationsByEmail[donation.email] = donationsByEmail[email] || {
      totalAmount: 0,
      name: donation.name,
      isCreator: false,
    };
    donationsByEmail[email].totalAmount =
      donationsByEmail[email].totalAmount + donation.amount;
  }
  const poolsCreatorsEmails = pools.map((p) => p.creatorEmail.toLowerCase());
  for (const toRemoveEmail of donationsEmailsToRemove) {
    delete donationsByEmail[toRemoveEmail];
  }
  for (const creatorEmail of poolsCreatorsEmails) {
    if (donationsByEmail[creatorEmail]) {
      donationsByEmail[creatorEmail].isCreator = true;
    }
  }
  console.log(JSON.stringify(donationsByEmail));
};

go();
