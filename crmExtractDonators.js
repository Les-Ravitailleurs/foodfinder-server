const db = require("./src/db");

const go = async () => {
  const donations = await db.Donation.findAll({
    order: [["createdAt", "ASC"]],
  });
  const extractByEmail = {};
  donations.forEach((donation) => {
    const email = donation.email;
    extractByEmail[email] = extractByEmail[email] || {
      total_donation_amount: 0,
    };
    extractByEmail[email].total_donation_amount += donation.amount / 100;
    extractByEmail[email].usage_name = donation.name;
    extractByEmail[email].total_name = donation.name;
  });
  let csv = "email,usage_name,total_name,total_donation_amount";
  for (const email in extractByEmail) {
    const data = extractByEmail[email];
    // console.log(data);
    csv = `${csv}\n${email},${data.usage_name || ""},${data.total_name || ""},${
      data.total_donation_amount || 0
    }`;
  }
  console.log(csv);
};

go();
