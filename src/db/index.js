const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = require("../config");

const { Sequelize, Model, DataTypes } = require("sequelize");
const buildUser = require("./models/user");
const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
});

module.exports = {
  sequelize,
  Sequelize,
  User: buildUser(sequelize, Sequelize),
};
