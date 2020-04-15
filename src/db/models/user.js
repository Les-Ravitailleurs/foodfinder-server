const { getIdFieldDef, addIdHooks } = require("../helpers");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: getIdFieldDef(),
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      email: Sequelize.STRING,
    },
    {
      tableName: "users",
      paranoid: true,
    }
  );
  addIdHooks(User);
  return User;
};
