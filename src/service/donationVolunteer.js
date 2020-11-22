const { Volunteer, Donation } = require("../db");

const getVolunteerByUsername = async (username) =>
  Volunteer.findOne({ where: { username } });

const getVolunteerById = async (id) => Volunteer.findByPk(id);

const getAllVolunteers = () => Volunteer.findAll();

const getDonationsById = async (id) => {
  const donations = await Donation.findAll({ where: { volunteerId: id } });
  return donations.reduce((a, b) => a + b.mealCount, 0);
};

module.exports = {
  getVolunteerByUsername,
  getVolunteerById,
  getAllVolunteers,
  getDonationsById,
};
