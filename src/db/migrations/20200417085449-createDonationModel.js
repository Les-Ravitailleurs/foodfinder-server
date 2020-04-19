const { getIdFieldDef } = require("../helpers");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("donations", {
      id: getIdFieldDef(),
      poolId: {
        type: Sequelize.STRING(21),
        references: {
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
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable("donations");
  },
};
