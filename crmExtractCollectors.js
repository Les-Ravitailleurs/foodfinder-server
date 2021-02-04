const db = require("./src/db");

const go = async () => {
  const donations = await db.Donation.findAll({
    order: [["createdAt", "ASC"]],
    include: [db.Volunteer],
    where: { volunteerId: { [db.Op.ne]: null } },
  });
  const collectes = {};
  donations.forEach((donation) => {
    collectes[donation.volunteerId] = collectes[donation.volunteerId] || {
      email: donation.Volunteer.email,
      usage_name: donation.Volunteer.name,
      total_name: donation.Volunteer.name,
      collector_link: `https://lesravitailleurs.org/collecte/?rav=${donation.Volunteer.username}`,
      dashboard_link: `https://lesravitailleurs.org/dashboard?token=${donation.Volunteer.id}`,
      total_collector_amount: 0,
    };
    collectes[donation.volunteerId].total_collector_amount +=
      donation.amount / 100;
  });
  const collectesByEmail = {};
  for (const volunteerId in collectes) {
    const collecte = collectes[volunteerId];
    if (collectesByEmail[collecte.email]) {
      if (
        collecte.total_collector_amount >
        collectesByEmail[collecte.email].total_collector_amount
      ) {
        // We keep data for the most efficient collecte
        collectesByEmail[collecte.email].usage_name = collecte.usage_name;
        collectesByEmail[collecte.email].total_name = collecte.total_name;
        collectesByEmail[collecte.email].collector_link =
          collecte.collector_link;
        collectesByEmail[collecte.email].dashboard_link =
          collecte.dashboard_link;
      }
      collectesByEmail[collecte.email].total_collector_amount +=
        collecte.total_collector_amount;
    } else {
      collectesByEmail[collecte.email] = {
        ...collecte,
      };
    }
  }
  const volunteers = await db.Volunteer.findAll();
  volunteers.forEach((v) => {
    if (!collectesByEmail[v.email]) {
      collectesByEmail[v.email] = {
        usage_name: v.name,
        total_name: v.name,
        collector_link: `https://lesravitailleurs.org/collecte/?rav=${v.username}`,
        dashboard_link: `https://lesravitailleurs.org/dashboard?token=${v.id}`,
        total_collector_amount: 0,
      };
    }
  });
  let csv =
    "email,usage_name,total_name,collector_link,dashboard_link,total_collector_amount";
  for (const email in collectesByEmail) {
    const data = collectesByEmail[email];
    // console.log(data);
    csv = `${csv}\n${email},${data.usage_name || ""},${data.total_name || ""},${
      data.collector_link || ""
    },${data.dashboard_link || ""},${data.total_collector_amount || 0}`;
  }
  console.log(csv);
};

go();
