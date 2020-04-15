const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = require("../config");

const dbConf = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  host: DB_HOST,
  dialect: "postgres",
};

module.exports = {
  development: dbConf,
  production: dbConf,
};
