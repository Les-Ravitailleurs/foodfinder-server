const { Sequelize } = require("sequelize");

const logger = require("../logger");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = require("../config");

const buildPool = require("./models/pool");
const buildDonation = require("./models/donation");
const buildSavedEmail = require("./models/savedEmail");
const buildVolunteer = require("./models/volunteer");

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  logging: (msg) => logger.debug(`[Sequelize] ${msg}`),
});

module.exports = {
  sequelize,
  Sequelize,
  Pool: buildPool(sequelize, Sequelize),
  Donation: buildDonation(sequelize, Sequelize),
  SavedEmail: buildSavedEmail(sequelize, Sequelize),
  Volunteer: buildVolunteer(sequelize, Sequelize),
};
