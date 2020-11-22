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
      donatorAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      taxReceiptId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      taxReceiptNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      taxReceiptURL: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      hideDonatorName: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      volunteerId: {
        type: Sequelize.STRING(21),
        reference: {
          model: "volunteers",
          key: "id",
        },
        allowNull: true,
      },
      likeCount: {
        type: Sequelize.BIGINT,
        allowNull: true,
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
