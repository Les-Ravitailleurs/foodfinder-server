const Joi = require("@hapi/joi");
const slugify = require("slugify");
const { sendEmail } = require("../../email/email");
const Config = require("../../config");

const ServiceDonationVolunteer = require("../../service/donationVolunteer");
const db = require("../../db");

const getDashboardData = async (req, res) => {
  const { volunteerId } = req.query;
  const volunteers = await ServiceDonationVolunteer.getAllVolunteers();
  const volunteer = volunteers.find((v) => v.id === volunteerId);
  if (!volunteer) {
    return res.status(404).json({});
  }
  const volunteersById = {};
  volunteers.forEach((v) => {
    volunteersById[v.id] = v;
  });
  const allDonations = await db.Donation.findAll({
    where: { poolId: "ravitailleurs" },
    attributes: [
      "id",
      "amount",
      "mealCount",
      "hideDonatorName",
      "name",
      "createdAt",
      "volunteerId",
      "likeCount",
    ],
    raw: true,
    order: [["createdAt", "DESC"]],
  });
  const donations = allDonations.map((d) => {
    const volunteer = d.volunteerId && volunteersById[d.volunteerId];
    return {
      ...d,
      volunteerId: null,
      name: d.hideDonatorName ? null : d.name,
      volunteerName: volunteer && volunteer.name,
      volunteerEmoji: volunteer && volunteer.emoji,
      me: volunteer && volunteer.id === volunteerId,
    };
  });
  res.json({ volunteer, donations });
};

const incrementLikeCount = async (req, res) => {
  const { volunteerId, donationId } = req.query;
  const volunteer = await ServiceDonationVolunteer.getVolunteerById(
    volunteerId
  );
  if (!volunteer) {
    return res.json({});
  }
  try {
    await db.Donation.increment("likeCount", { where: { id: donationId } });
  } catch (e) {
    console.log(e);
  }
  return res.json({});
};

const findUsernameForVolunteer = async (username) => {
  const initialSlug = slugify(username, { lower: true });
  let slug = initialSlug;
  let volunteerExists = await db.Volunteer.findOne({
    where: { username: slug },
  });
  let count = 1;
  while (volunteerExists) {
    slug = `${initialSlug}${count}`;
    volunteerExists = await db.Volunteer.findOne({ where: { username: slug } });
    count += 1;
  }
  return slug;
};

const createVolunteer = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    emoji: Joi.string().required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
  });
  const { value, error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error });
  const availableUsername = await findUsernameForVolunteer(value.username);
  const newVolunteer = await db.Volunteer.create({
    ...value,
    username: availableUsername,
  });
  res.json(newVolunteer);
  sendEmail("volunteer_link", newVolunteer.email, {
    __NAME__: value.name,
    __LINK__: `${Config.BASE_URL}/collecte/?rav=${newVolunteer.username}`,
    __DASHBOARD_LINK__: `${Config.BASE_URL}/dashboard?token=${newVolunteer.id}`,
  });
};

module.exports = { getDashboardData, incrementLikeCount, createVolunteer };
