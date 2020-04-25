const { getIdFieldDef, addIdHooks } = require("../helpers");

module.exports = (sequelize, Sequelize) => {
  const SavedEmail = sequelize.define(
    "SavedEmail",
    {
      id: getIdFieldDef(),
      poolId: {
        type: Sequelize.STRING(21),
        reference: {
          model: "pools",
          key: "id",
        },
        allowNull: false,
      },
      mealCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "savedEmails",
      paranoid: true,
    }
  );
  addIdHooks(SavedEmail);
  return SavedEmail;
};
