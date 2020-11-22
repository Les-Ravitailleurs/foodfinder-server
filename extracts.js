const db = require("./src/db");

const go = async () => {
  const donations = await db.Donation.findAll({
    order: [["createdAt", "ASC"]],
  });
  const pools = await db.Pool.findAll();
  const extractByEmail = {};
  donations.forEach((donation) => {
    const email = donation.email;
    extractByEmail[email] = extractByEmail[email] || {
      amount: 0,
    };
    extractByEmail[email].amount += donation.amount;
    extractByEmail[email].name = donation.name;
    extractByEmail[email].hideDonatorName = donation.hideDonatorName;
    extractByEmail[email].donator = true;
  });
  pools.forEach((pool) => {
    const email = pool.creatorEmail;
    extractByEmail[email] = extractByEmail[email] || {
      amount: 0,
    };
    extractByEmail[email].creator = true;
  });
  let csv = 'email,name,hideName,isDonator,donatedAmount,isPoolCreator';
  for (const email in extractByEmail) {
    const data = extractByEmail[email];
    // console.log(data);
    csv = `${csv}\n${email},${data.name||''},${data.hideDonatorName||false},${data.donator||false},${data.amount||0},${data.creator||false}`;
  }
  console.log(csv);
};

go();
