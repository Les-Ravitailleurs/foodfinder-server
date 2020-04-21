const { getIdFieldDef, addIdHooks } = require("../helpers");

module.exports = (sequelize, Sequelize) => {
  const Donation = sequelize.define(
    "Donation",
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
      amount: { type: Sequelize.INTEGER, allowNull: false },
      mealCount: { type: Sequelize.INTEGER, allowNull: false },
      stripePaymentIntentId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      stripeName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "donations",
      paranoid: true,
    }
  );
  addIdHooks(Donation);
  return Donation;
};
