const { getIdFieldDef, addIdHooks } = require("../helpers");

module.exports = (sequelize, Sequelize) => {
  const Volunteer = sequelize.define(
    "Volunteer",
    {
      id: getIdFieldDef(),
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emoji: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "volunteers",
      paranoid: true,
    }
  );
  addIdHooks(Volunteer);
  return Volunteer;
};
